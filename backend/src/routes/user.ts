import {signInInput, signUpInput} from '@eivor1000/medium-common';
import {Prisma, PrismaClient} from '@prisma/client/edge'
import {withAccelerate} from '@prisma/extension-accelerate'
import {OpenAPIHono} from '@hono/zod-openapi';
import {decode, sign, verify} from 'hono/jwt'
import bcrypt from 'bcryptjs';
import {sanitizeInput} from '../utils/sanitizer';
import {signUpRoute, signInRoute} from '../schemas/openapi';

// Helper function for consistent database error handling
function handleDatabaseError(error: any) {
  if (error.code === 'P2002') {
    return 'Record already exists';
  }
  if (error.code === 'P2025') {
    return 'Record not found';
  }
  if (error.code === 'P2003') {
    return 'Foreign key constraint failed';
  }
  return 'Database operation failed';
}

// Create the main OpenAPI Hono app
export const userRouter = new OpenAPIHono<{
  Bindings: {DATABASE_URL: string, JWT_SECRET: string},
}>()

userRouter.openapi(signUpRoute, async (c) => {
  const body = await c.req.json();

  // Sanitize input data before validation
  const sanitizedBody = {
    username: sanitizeInput(body.username),
    password: body.password, // Don't sanitize password
    name: sanitizeInput(body.name)
  };

  const {success} = signUpInput.safeParse(sanitizedBody);
  if (!success) {
    c.status(411);
    return c.json({message: 'Inputs are not correct'})
  }

  const prisma = new PrismaClient({
                   datasourceUrl: c.env.DATABASE_URL,
                 }).$extends(withAccelerate());

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Hash password before storing
      const hashedPassword = await bcrypt.hash(body.password, 10);

      // Create user first
      const user = await tx.user.create({
        data: {username: sanitizedBody.username, password: hashedPassword, name: sanitizedBody.name}
      });

      // Generate JWT - if this fails, user creation rolls back
      const jwt = await sign({id: user.id}, c.env.JWT_SECRET);

      return {user, jwt};
    });

    return c.text(result.jwt);
  } catch (e: any) {
    const errorMessage = handleDatabaseError(e);
    const statusCode = e.code === 'P2002' ? 409 : 411;
    c.status(statusCode);
    return c.text(errorMessage);
  }
})

userRouter.openapi(signInRoute, async (c) => {
  const body = await c.req.json();

  // Sanitize input data before validation
  const sanitizedBody = {
    username: sanitizeInput(body.username),
    password: body.password // Don't sanitize password
  };

  const {success} = signInInput.safeParse(sanitizedBody);
  if (!success) {
    c.status(411);
    return c.json({message: 'Inputs are not correct'})
  }

  const prisma = new PrismaClient({
                   datasourceUrl: c.env.DATABASE_URL,
                 }).$extends(withAccelerate());

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Find user by username only
      const user = await tx.user.findFirst({
        where: {username: sanitizedBody.username}
      });

      // Verify password with bcrypt
      if (!user || !await bcrypt.compare(body.password, user.password)) {
        throw new Error('Incorrect Credentials');
      }

      // Generate JWT - if this fails, operation rolls back
      const jwt = await sign({id: user.id}, c.env.JWT_SECRET);

      return {user, jwt};
    });

    return c.text(result.jwt);
  } catch (e: any) {
    if (e.message === 'Incorrect Credentials') {
      c.status(403);
      return c.json({message: 'Incorrect Credentials'});
    }

    const errorMessage = handleDatabaseError(e);
    c.status(411);
    return c.text(errorMessage);
  }
})