import {createBlogInput} from '@eivor1000/medium-common';
import {Prisma, PrismaClient} from '@prisma/client/edge'
import {withAccelerate} from '@prisma/extension-accelerate'
import {OpenAPIHono} from '@hono/zod-openapi';
import {decode, sign, verify} from 'hono/jwt'
import {sanitizeInput, sanitizeHtml} from '../utils/sanitizer';
import {createBlogRoute, updateBlogRoute, getBlogsRoute, getBlogRoute} from '../schemas/openapi';

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

export const blogRouter = new OpenAPIHono<{
  Bindings: {DATABASE_URL: string, JWT_SECRET: string},
  Variables: {userId: string}
}>();

blogRouter.use('/*', async (c, next) => {
  const authHeader = c.req.header('authorization') || ' ';
  try {
    const user = await verify(authHeader, c.env.JWT_SECRET);
    if (user) {
      c.set('userId', user.id as string);
      await next();
    } else {
      c.status(403);
      return c.json({message: 'You have not logged in'})
    }
  } catch (e) {
    c.status(403);
    return c.json({message: 'You have not logged in'})
  }
})

// Creating Blogs
blogRouter.openapi(createBlogRoute, async (c) => {
  const body = await c.req.json();

  // Sanitize input data before validation
  const sanitizedBody = {
    title: sanitizeInput(body.title),
    content: sanitizeHtml(body.content)
  };

  const {success} = createBlogInput.safeParse(sanitizedBody);
  if (!success) {
    c.status(411);
    return c.json({message: 'Inputs are not correct'})
  }

  const authorId = c.get('userId');
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.$transaction(async (tx) => {
      // Verify author exists (foreign key constraint)
      const author = await tx.user.findUnique({
        where: { id: Number(authorId) }
      });

      if (!author) {
        throw new Error('Invalid author ID');
      }

      // Create blog with verified foreign key
      return await tx.blog.create({
        data: { title: sanitizedBody.title, content: sanitizedBody.content, authorId: Number(authorId) }
      });
    });

    return c.json({ id: blog.id });
  } catch (e: any) {
    if (e.message === 'Invalid author ID') {
      c.status(403);
      return c.json({ message: 'Unauthorized' });
    }

    const errorMessage = handleDatabaseError(e);
    const statusCode = e.code === 'P2002' ? 409 : 400;
    c.status(statusCode);
    return c.json({ message: errorMessage });
  }
})

// Updating Blogs
blogRouter.openapi(updateBlogRoute, async (c) => {
  const body = await c.req.json();

  // Sanitize input data before validation
  const sanitizedBody = {
    id: body.id, // ID doesn't need sanitization
    title: sanitizeInput(body.title),
    content: sanitizeHtml(body.content)
  };

  const {success} = createBlogInput.safeParse(sanitizedBody);
  if (!success) {
    c.status(411);
    return c.json({message: 'Inputs are not correct'})
  }

  const userId = c.get('userId');
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.$transaction(async (tx) => {
      // Verify blog exists and user owns it (authorization + foreign key check)
      const existingBlog = await tx.blog.findFirst({
        where: { id: sanitizedBody.id, authorId: Number(userId) }
      });

      if (!existingBlog) {
        throw new Error('Blog not found or unauthorized');
      }

      // Update atomically
      return await tx.blog.update({
        where: { id: sanitizedBody.id },
        data: { title: sanitizedBody.title, content: sanitizedBody.content }
      });
    });

    return c.json({ id: blog.id });
  } catch (e: any) {
    if (e.message === 'Blog not found or unauthorized') {
      c.status(403);
      return c.json({ message: 'Blog not found or unauthorized' });
    }

    const errorMessage = handleDatabaseError(e);
    const statusCode = e.code === 'P2025' ? 404 : 400;
    c.status(statusCode);
    return c.json({ message: errorMessage });
  }
})

// Add pagination
// Getting all the blogs
blogRouter.openapi(getBlogsRoute, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blogs = await prisma.$transaction(async (tx) => {
      return await tx.blog.findMany({
        select: {
          content: true,
          title: true,
          id: true,
          author: { select: { name: true } }
        }
      });
    });

    return c.json({ blogs });
  } catch (e: any) {
    const errorMessage = handleDatabaseError(e);
    c.status(500);
    return c.json({ message: errorMessage });
  }
})

// Getting the blog using ID
blogRouter.openapi(getBlogRoute, async (c) => {
  const id = c.req.param('id');
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.$transaction(async (tx) => {
      const blog = await tx.blog.findFirst({
        where: { id: Number(id) },
        select: {
          id: true,
          title: true,
          content: true,
          author: { select: { name: true } }
        }
      });

      if (!blog) {
        throw new Error('Blog not found');
      }

      return blog;
    });

    return c.json({ blog });
  } catch (e: any) {
    if (e.message === 'Blog not found') {
      c.status(404);
      return c.json({ message: 'Blog not found' });
    }

    const errorMessage = handleDatabaseError(e);
    c.status(500);
    return c.json({ message: errorMessage });
  }
})

export default blogRouter;