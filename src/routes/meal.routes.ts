import { type FastifyInstance } from 'fastify'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { createMeal, deleteMeal, getAllMeals, getMealById, updateMeal } from '../controllers/mealController'

export async function mealRoutes (app: FastifyInstance): Promise<void> {
  app.addHook('preHandler', checkSessionIdExists)

  app.post('/meal', createMeal)
  app.get('/meal', getAllMeals)
  app.get('/meal/:id', getMealById)
  app.put('/meal/:id', updateMeal)
  app.delete('/meal/:id', deleteMeal)
}
