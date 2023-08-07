import { hash } from 'bcrypt'
import { randomUUID } from 'crypto'
import { type FastifyInstance } from 'fastify'
import knex from 'knex'
import { z } from 'zod'

export async function userRoutes (app: FastifyInstance): Promise<void> {
  app.post('/register', async (request, reply) => {
    const createUserBodySchema = z.object({
      email: z.string(),
      password: z.string()
    })

    try {
      const { email, password } = createUserBodySchema.parse(request.body)

      const hashedPassword = await hash(password, 8)

      await knex('users').insert({
        id: randomUUID(),
        email,
        password: hashedPassword
      })

      return await reply.status(201).send({ message: 'User successfully created!' })
    } catch (error) {
      console.error(error) // Log the error for debugging purposes
      return await reply.status(500).send({ message: 'Error creating user.' })
    }
  })
}