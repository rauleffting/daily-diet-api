import { type FastifyInstance } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { compare, hash } from 'bcrypt'
import { createUserBodySchema } from '../schemas'

export async function userRoutes (app: FastifyInstance): Promise<void> {
  app.post('/register', async (request, reply) => {
    try {
      const { email, password } = createUserBodySchema.parse(request.body)

      const userExists = await knex('users')
        .where({ email })
        .first()

      if (userExists) {
        return await reply.status(409).send({ message: 'E-mail já cadastrado!' }) // Changed status code to 409 Conflict
      }

      const hashedPassword = await hash(password, 8)

      await knex('users').insert({
        id: randomUUID(),
        email,
        password: hashedPassword
      })

      return await reply.status(201).send({ message: 'User successfully created!' }) // Using 201 for successful resource creation
    } catch (error) {
      console.error(error) // Log the error for debugging purposes
      return await reply.status(500).send({ message: 'Error creating user!' })
    }
  })

  app.post('/login', async (request, reply) => {
    try {
      const { email, password } = createUserBodySchema.parse(request.body)

      const user = await knex('users')
        .where({ email })
        .first()

      if (!user) {
        return await reply.status(401).send({ message: 'E-mail e/ou senha incorretos.' }) // Changed status code to 401 Unauthorized
      }

      const passwordMatched = await compare(password, user.password)

      if (!passwordMatched) {
        return await reply.status(401).send({ message: 'E-mail e/ou senha incorretos.' }) // Changed status code to 401 Unauthorized
      }

      let sessionId = request.cookies.sessionId

      if (!sessionId) {
        sessionId = randomUUID()

        reply.cookie('sessionId', sessionId, {
          maxAge: 1000 * 60 * 60 * 24 * 365 // 365 days
        })
      }

      return await reply.status(200).send({ message: 'User successfully logged!' }) // Using 200 for successful login
    } catch (error) {
      console.error(error) // Log the error for debugging purposes
      return await reply.status(500).send({ message: 'Error trying to log in!' })
    }
  })
}
