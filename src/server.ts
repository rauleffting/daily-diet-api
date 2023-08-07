import { app } from './app'
import { env } from './env'

const port = env.PORT

app.listen({ port })
  .then(() => {
    console.log(`HTTP Server running on PORT: ${port}`)
  })
  .catch((error) => {
    console.error('Error starting the server:', error)
  })
