import {Prisma, PrismaClient} from '@prisma/client/edge'
import {withAccelerate} from '@prisma/extension-accelerate'
import {Hono} from 'hono';
import {decode, sign, verify} from 'hono/jwt'

import blogRouter from './routes/blog';
import {userRouter} from './routes/user';

// Create the main Hono app
const app = new Hono<{Bindings: {DATABASE_URL: string, JWT_SECRET: string}}>()

app.route('/api/v1/user', userRouter);
app.route('/api/v1/blog', blogRouter);

export default app;

// postgres://avnadmin:AVNS_D9hNNpauzmvHeSDaXaj@project-medium-ayush.c.aivencloud.com:19247/defaultdb?sslmode=require

// DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19OcHZMU0o5dzZrSjNfZlFlMW9GUlIiLCJhcGlfa2V5IjoiMDFLMEVXQkhDSEQ4V1BIWUJXWEQ5MkpZUlkiLCJ0ZW5hbnRfaWQiOiJkNWU5NmIyNWRhODkyNDZiOWE3MWZhMGRmZDA4MTM5NzFkZWIzMDllNmQ3NDRjMWQ3MmRkYjlhODRkNjc0YzcwIiwiaW50ZXJuYWxfc2VjcmV0IjoiNWRkOWQyNGMtNzVmZC00M2FiLWI2MTAtZjIzZTExMDAxZjM4In0.Hel61_12QVUqKk5Dnz80IgdDaetd6lAf0YWTIf8MbLQ"