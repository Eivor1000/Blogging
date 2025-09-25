import { z } from 'zod';
import { createRoute } from '@hono/zod-openapi';

// Schema definitions
export const SignUpSchema = z.object({
  username: z.string().min(1).max(50).describe('Unique username'),
  password: z.string().min(6).describe('User password (minimum 6 characters)'),
  name: z.string().min(1).max(100).describe('User display name')
});

export const SignInSchema = z.object({
  username: z.string().min(1).describe('Username'),
  password: z.string().min(1).describe('User password')
});

export const CreateBlogSchema = z.object({
  title: z.string().min(1).max(200).describe('Blog title'),
  content: z.string().min(1).describe('Blog content (HTML allowed)')
});

export const UpdateBlogSchema = z.object({
  id: z.number().int().positive().describe('Blog ID'),
  title: z.string().min(1).max(200).describe('Blog title'),
  content: z.string().min(1).describe('Blog content (HTML allowed)')
});

export const BlogResponseSchema = z.object({
  id: z.number().int().describe('Blog ID'),
  title: z.string().describe('Blog title'),
  content: z.string().describe('Blog content'),
  author: z.object({
    name: z.string().describe('Author name')
  })
});

export const ErrorSchema = z.object({
  message: z.string().describe('Error message')
});

// Route definitions
export const signUpRoute = createRoute({
  method: 'post',
  path: '/signup',
  request: {
    body: {
      content: {
        'application/json': {
          schema: SignUpSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'User created successfully',
      content: {
        'text/plain': {
          schema: z.string().describe('JWT token'),
        },
      },
    },
    409: {
      description: 'User already exists',
      content: {
        'text/plain': {
          schema: z.string().describe('Error message'),
        },
      },
    },
    411: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
    },
  },
  tags: ['Authentication'],
});

export const signInRoute = createRoute({
  method: 'post',
  path: '/signin',
  request: {
    body: {
      content: {
        'application/json': {
          schema: SignInSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Login successful',
      content: {
        'text/plain': {
          schema: z.string().describe('JWT token'),
        },
      },
    },
    403: {
      description: 'Invalid credentials',
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
    },
    411: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
    },
  },
  tags: ['Authentication'],
});

export const createBlogRoute = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateBlogSchema,
        },
      },
    },
    headers: z.object({
      authorization: z.string().describe('Bearer JWT token'),
    }),
  },
  responses: {
    200: {
      description: 'Blog created successfully',
      content: {
        'application/json': {
          schema: z.object({
            id: z.number().describe('Created blog ID'),
          }),
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
    },
    403: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
    },
    411: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
    },
  },
  tags: ['Blogs'],
});

export const updateBlogRoute = createRoute({
  method: 'put',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: UpdateBlogSchema,
        },
      },
    },
    headers: z.object({
      authorization: z.string().describe('Bearer JWT token'),
    }),
  },
  responses: {
    200: {
      description: 'Blog updated successfully',
      content: {
        'application/json': {
          schema: z.object({
            id: z.number().describe('Updated blog ID'),
          }),
        },
      },
    },
    403: {
      description: 'Unauthorized or blog not found',
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
    },
    404: {
      description: 'Blog not found',
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
    },
    411: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
    },
  },
  tags: ['Blogs'],
});

export const getBlogsRoute = createRoute({
  method: 'get',
  path: '/bulk',
  request: {
    headers: z.object({
      authorization: z.string().describe('Bearer JWT token'),
    }),
  },
  responses: {
    200: {
      description: 'List of blogs',
      content: {
        'application/json': {
          schema: z.object({
            blogs: z.array(BlogResponseSchema),
          }),
        },
      },
    },
    500: {
      description: 'Server error',
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
    },
  },
  tags: ['Blogs'],
});

export const getBlogRoute = createRoute({
  method: 'get',
  path: '/{id}',
  request: {
    params: z.object({
      id: z.string().describe('Blog ID'),
    }),
    headers: z.object({
      authorization: z.string().describe('Bearer JWT token'),
    }),
  },
  responses: {
    200: {
      description: 'Blog details',
      content: {
        'application/json': {
          schema: z.object({
            blog: BlogResponseSchema,
          }),
        },
      },
    },
    404: {
      description: 'Blog not found',
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
    },
    500: {
      description: 'Server error',
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
    },
  },
  tags: ['Blogs'],
});