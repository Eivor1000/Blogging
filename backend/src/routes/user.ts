import {signInInput, signUpInput} from '@eivor1000/medium-common';
import {Prisma, PrismaClient} from '@prisma/client/edge'
import {withAccelerate} from '@prisma/extension-accelerate'
import {Hono} from 'hono';
import {decode, sign, verify} from 'hono/jwt'

// Create the main Hono app
export const userRouter = new Hono<{
  Bindings: {DATABASE_URL: string, JWT_SECRET: string},
}>()

userRouter.post('/signup', async (c) => {
  const body = await c.req.json();
  const {success} = signUpInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({message: 'Inputs are not correct'})
  }
  const prisma = new PrismaClient({
                   datasourceUrl: c.env.DATABASE_URL,
                 }).$extends(withAccelerate());
  try {
    const user = await prisma.user.create({
      data: {username: body.username, password: body.password, name: body.name}
    })
    const jwt = await sign({id: user.id}, c.env.JWT_SECRET);
    return c.text(jwt);
  } catch (e) {
    c.status(411);
    console.log(e);
    return c.text('User already exists');
  }
})

userRouter.post('/signin', async (c) => {
  const body = await c.req.json();
  const {success} = signInInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({message: 'Inputs are not correct'})
  }
  const prisma = new PrismaClient({
                   datasourceUrl: c.env.DATABASE_URL,
                 }).$extends(withAccelerate());
  try {
    const user = await prisma.user.findFirst(
        {where: {username: body.username, password: body.password}})
    if (!user) {
      c.status(403);
      return c.json({message: 'Incorrect Credentials'})
    }
    const jwt = await sign({id: user.id}, c.env.JWT_SECRET);
    return c.text(jwt);
  } catch (e) {
    c.status(411);
    console.log(e);
    return c.text('User already exists');
  }
})