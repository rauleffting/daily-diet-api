import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { execSync } from 'child_process'
import { app } from '../../app'
import { knex } from '../../database'

describe('User routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all') // delete db
    execSync('npm run knex migrate:latest') // create db
  })

  it('Should create a new user', async () => {
    const response = await request(app.server)
      .post('/register')
      .send({ email: 'test@example.com', password: 'test123' })

    expect(response.statusCode).toBe(201)
    expect(response.body.message).toBe('User successfully created!')

    const user = await knex('users').where('email', 'test@example.com').first()
    expect(user).not.toBeNull()
  })
})
