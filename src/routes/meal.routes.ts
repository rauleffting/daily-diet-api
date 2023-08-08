import { type FastifyInstance } from 'fastify'
import { createMealBodySchema } from '../schemas'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { randomUUID } from 'crypto'
import { knex } from '../database'

export async function mealRoutes (app: FastifyInstance): Promise<void> {
  app.addHook('preHandler', checkSessionIdExists)

  app.post('/meal', async (request, reply) => {
    try {
      const { sessionId } = request.cookies
      const { name, description, isDietMeal } = createMealBodySchema.parse(request.body)

      if (!name || !description || isDietMeal === undefined) {
        return await reply.status(409).send({ message: 'Please fill all fields.' })
      }

      await knex('meals').insert({
        id: randomUUID(),
        session_id: sessionId,
        name,
        description,
        is_diet_meal: isDietMeal
      })

      return await reply.status(201).send({ message: 'Meal successfully created!' })
    } catch (error) {
      console.error(error)
      return await reply.status(500).send({ message: 'Error creating meal!' })
    }
  })
}
