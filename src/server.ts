import fastify from 'fastify'

const app = fastify()

const port = 3333

app.listen({ port })
  .then(() => {
    console.log(`HTTP Server running on PORT: ${port}`)
  })
  .catch((error) => {
    console.error('Error starting the server:', error)
  })
