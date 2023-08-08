import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../app'
import { knex } from '../database'

describe('User routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should create a new user', async () => {
    const mockUser = {
      email: 'test@example.com',
      password: 'test123'
    }

    const response = await request(app.server)
      .post('/register')
      .send(mockUser)

    expect(response.statusCode).toBe(201)
    expect(response.body.message).toBe('User successfully created!')

    const user = await knex('users').where('email', 'test@example.com').first()
    expect(user).not.toBeNull()
  })

  it('should allow a user to log in with a valid email and password', async () => {
    const mockUser = {
      email: 'test@example.com',
      password: 'test123'
    }

    await request(app.server).post('/register').send(mockUser)

    const response = await request(app.server).post('/login').send(mockUser)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ message: 'User successfully logged!' })
  })

  it('should create a cookie when user logs in', async () => {
    const mockUser = {
      email: 'test@example.com',
      password: 'test123'
    }

    await request(app.server).post('/register').send(mockUser)

    const response = await request(app.server).post('/login').send(mockUser)

    expect(response.header['set-cookie'][0]).toContain('sessionId=')
    expect(response.header['set-cookie'][0]).toContain('Max-Age=')
  })
})
