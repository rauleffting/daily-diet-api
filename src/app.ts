import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { userRoutes } from './routes/user.routes'

export const app = fastify()

app.register(cookie)
app.register(userRoutes)
