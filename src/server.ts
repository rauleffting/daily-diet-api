import fastify from 'fastify'
import { userRoutes } from './tests/unit/routes/user.routes'
import { env } from './env'

const app = fastify()

app.register(userRoutes)

const port = env.PORT

app.listen({ port })
  .then(() => {
    console.log(`HTTP Server running on PORT: ${port}`)
  })
  .catch((error) => {
    console.error('Error starting the server:', error)
  })
