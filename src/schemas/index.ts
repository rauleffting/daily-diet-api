import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333)
})

export const createUserBodySchema = z.object({
  email: z.string(),
  password: z.string()
})

export const createMealBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  isDietMeal: z.boolean()
})

export const getMealParamsSchema = z.object({
  id: z.string().uuid()
})
