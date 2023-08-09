import { type FastifyReply, type FastifyRequest } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { createUserBodySchema } from '../schemas'
import { compare, hash } from 'bcrypt'

export async function createUser (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const { email, password } = createUserBodySchema.parse(request.body)

    const userExists = await knex('users')
      .where({ email })
      .first()

    if (userExists) {
      return await reply.status(409).send({ message: 'Email already registered!' })
    }

    const hashedPassword = await hash(password, 8)

    await knex('users').insert({
      id: randomUUID(),
      email,
      password: hashedPassword
    })

    return await reply.status(201).send({ message: 'User successfully created!' })
  } catch (error) {
    console.error(error)
    return await reply.status(500).send({ message: 'Error creating user!' })
  }
}

export async function login (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const { email, password } = createUserBodySchema.parse(request.body)

    const user = await knex('users')
      .where({ email })
      .first()

    if (!user) {
      return await reply.status(401).send({ message: 'Wrong email or password.' })
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      return await reply.status(401).send({ message: 'Wrong email or password.' })
    }

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        maxAge: 1000 * 60 * 60 * 24 * 365 // 365 days
      })
    }

    return await reply.status(200).send({ message: 'User successfully logged!' })
  } catch (error) {
    console.error(error)
    return await reply.status(500).send({ message: 'Error trying to log in!' })
  }
}

export async function getMetrics (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const { sessionId } = request.cookies

    const meals = await knex('meals')
      .where({ session_id: sessionId })
      .select()

    const dietMeals = await knex('meals')
      .where({ session_id: sessionId, is_diet_meal: true })
      .select()

    let oldSequencyArray = []
    let currentSequencyArray = []
    let bestSequencyArray = []

    for (let i = 0; i < meals.length; i++) {
      if (meals[i].is_diet_meal) {
        currentSequencyArray.push(meals[i])
      } else {
        if (currentSequencyArray.length >= oldSequencyArray.length) {
          oldSequencyArray = currentSequencyArray
        }
        currentSequencyArray = []
      }
    }

    currentSequencyArray.length >= oldSequencyArray.length
      ? bestSequencyArray = currentSequencyArray
      : bestSequencyArray = oldSequencyArray

    const metrics = {
      total_of_meals: meals.length,
      total_of_diet_meals: dietMeals.length,
      total_of_no_diet_meals: meals.length - dietMeals.length,
      best_sequency_meals: bestSequencyArray
    }

    if (!metrics) {
      return await reply.status(404).send({ message: 'Metrics not found!' })
    }
    return await reply.status(200).send(metrics)
  } catch (error) {
    console.error(error)
    return await reply.status(500).send({ message: 'Error while searching!' })
  }
}
