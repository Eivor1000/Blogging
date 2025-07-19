import z from 'zod';

export const signUpInput = z.object({
  username: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional()
})

// type interference in zod
export type SignUpInput = z.infer<typeof signUpInput>;

export const signInInput = z.object({
  username: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional()
})

// type interference in zod
export type SignInInput = z.infer<typeof signInInput>;

export const createBlogInput = z.object({
  title: z.string(),
  content: z.string(),
})

export type CreateBlockInput = z.infer<typeof createBlogInput>;

export const updateBlogInput = z.object({
  title: z.string(),
  content: z.string(),
})

export type UpdateBlockInput = z.infer<typeof updateBlogInput>;