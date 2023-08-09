import { type FastifyInstance } from 'fastify'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { createUser, getMetrics, login } from '../controllers/userController'

export async function userRoutes (app: FastifyInstance): Promise<void> {
  app.post('/register', createUser)
  app.post('/login', login)
  app.get('/metrics', { preHandler: [checkSessionIdExists] }, getMetrics)
}
