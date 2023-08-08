import { compare, hash } from 'bcrypt'
import { randomUUID } from 'crypto'
import { type FastifyInstance } from 'fastify'
import { knex } from '../database'
import { createUserBodySchema } from '../schemas'

export async function userRoutes (app: FastifyInstance): Promise<void> {
  app.post('/register', async (request, reply) => {
    try {
      const { email, password } = createUserBodySchema.parse(request.body)

      const userExists = await knex('users')
        .where({ email })
        .first()

      if (userExists) {
        return await reply.status(509).send({ message: 'E-mail já cadastrado!' })
      }

      const hashedPassword = await hash(password, 8)

      await knex('users').insert({
        id: randomUUID(),
        email,
        password: hashedPassword
      })

      return await reply.status(201).send({ message: 'User successfully created!' })
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
        return await reply.status(509).send({ message: 'E-mail e/ou senha incorretos.' })
      }

      const passwordMatched = await compare(password, user.password)

      if (!passwordMatched) {
        return await reply.status(509).send({ message: 'E-mail e/ou senha incorretos.' })
      }

      let sessionId = request.cookies.sessionId

      if (sessionId === null) {
        sessionId = randomUUID()

        reply.cookie('sessionId', sessionId, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 30 * 12 // 1 year
        })
      }

      return await reply.status(201).send({ message: 'User successfully logged!' })
    } catch (error) {
      console.error(error) // Log the error for debugging purposes
      return await reply.status(509).send({ message: 'Error trying to log in!' })
    }
  })
}
