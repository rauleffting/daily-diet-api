import { type FastifyReply, type FastifyRequest } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { createMealBodySchema, getMealParamsSchema } from '../schemas'

export async function createMeal (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
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
}

export async function getAllMeals (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const { sessionId } = request.cookies

    const meals = await knex('meals')
      .where({ session_id: sessionId })
      .select()

    if (!meals) {
      return await reply.status(404).send({ message: 'No meals found!' })
    }
    return await reply.status(200).send(meals)
  } catch (error) {
    console.error(error)
    return await reply.status(500).send({ message: 'Error while searching!' })
  }
}

export async function getMealById (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const { id } = getMealParamsSchema.parse(request.params)
    const { sessionId } = request.cookies

    const meal = await knex('meals')
      .where({ session_id: sessionId, id })
      .first()

    if (!meal) {
      return await reply.status(404).send({ message: 'Meal not found!' })
    }
    return await reply.status(200).send(meal)
  } catch (error) {
    console.error(error)
    return await reply.status(500).send({ message: 'Error while searching!' })
  }
}

export async function updateMeal (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const { id } = getMealParamsSchema.parse(request.params)
    const { sessionId } = request.cookies
    const { name, description, isDietMeal } = createMealBodySchema.parse(request.body)

    const updateMeal = await knex('meals')
      .where({ session_id: sessionId, id })
      .update({
        name,
        description,
        is_diet_meal: isDietMeal,
        updated_at: knex.fn.now()
      })

    if (!updateMeal) {
      return await reply.status(404).send({ message: 'Meal not found!' })
    }
    return await reply.status(200).send({ message: 'Meal successfully updated!' })
  } catch (error) {
    console.error(error)
    return await reply.status(500).send({ message: 'Error while updating!' })
  }
}

export async function deleteMeal (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const { id } = getMealParamsSchema.parse(request.params)
    const { sessionId } = request.cookies

    const deleteMeal = await knex('meals')
      .where({ session_id: sessionId, id })
      .delete()

    if (!deleteMeal) {
      return await reply.status(404).send({ message: 'Meal not found!' })
    }
    return await reply.status(200).send({ message: 'Meal successfully deleted!' })
  } catch (error) {
    console.error(error)
    return await reply.status(500).send({ message: 'Error while deleting!' })
  }
}
