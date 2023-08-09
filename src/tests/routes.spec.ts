import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../app'
import { knex } from '../database'

describe('User routes', () => {
  beforeAll(async () => {
    await app.ready()
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

  it('should allow user to access their metrics', async () => {
    const mockUser = {
      email: 'test@example.com',
      password: 'test123'
    }

    const mockMeal1 = {
      name: 'McDonalds',
      description: 'Big Tasty + Milk Shake',
      isDietMeal: false
    }

    const mockMeal2 = {
      name: 'Salad Bar',
      description: 'Healthy Salad',
      isDietMeal: true
    }

    await request(app.server).post('/register').send(mockUser)
    const logIn = await request(app.server).post('/login').send(mockUser)
    const cookies = logIn.get('Set-Cookie')

    await request(app.server)
      .post('/meal')
      .set('Cookie', cookies)
      .send(mockMeal1)

    await request(app.server)
      .post('/meal')
      .set('Cookie', cookies)
      .send(mockMeal2)

    const response = await request(app.server)
      .get('/metrics')
      .set('Cookie', cookies)

    expect(response.statusCode).toBe(200)
    expect(response.body.total_of_meals).toBe(2)
    expect(response.body.total_of_diet_meals).toBe(1)
    expect(response.body.total_of_no_diet_meals).toBe(1)
    expect(response.body.best_sequency_meals.length).toBe(1)
  })
})

describe('Meal routes', () => {
  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should create a new meal', async () => {
    const mockUser = {
      email: 'test@example.com',
      password: 'test123'
    }

    const mockMeal = {
      name: 'McDonalds',
      description: 'Big Tasy + Milk Shake',
      isDietMeal: false
    }

    await request(app.server).post('/register').send(mockUser)
    const logIn = await request(app.server).post('/login').send(mockUser)

    const cookies = logIn.get('Set-Cookie')

    const response = await request(app.server)
      .post('/meal')
      .set('Cookie', cookies)
      .send(mockMeal)

    expect(response.statusCode).toBe(201)
    expect(response.body.message).toBe('Meal successfully created!')
  })

  it('should get all meals', async () => {
    const mockUser = {
      email: 'test@example.com',
      password: 'test123'
    }

    const mockMeal = {
      name: 'McDonalds',
      description: 'Big Tasy + Milk Shake',
      isDietMeal: false
    }

    await request(app.server).post('/register').send(mockUser)
    const logIn = await request(app.server).post('/login').send(mockUser)

    const cookies = logIn.get('Set-Cookie')

    await request(app.server)
      .post('/meal')
      .set('Cookie', cookies)
      .send(mockMeal)

    const response = await request(app.server)
      .get('/meal')
      .set('Cookie', cookies)

    expect(response.statusCode).toBe(200)
    expect(response.body).toBeDefined()
  })

  it('should get meal by id', async () => {
    const mockUser = {
      email: 'test@example.com',
      password: 'test123'
    }

    const mockMeal = {
      name: 'McDonalds',
      description: 'Big Tasy + Milk Shake',
      isDietMeal: false
    }

    await request(app.server).post('/register').send(mockUser)
    const logIn = await request(app.server).post('/login').send(mockUser)

    const cookies = logIn.get('Set-Cookie')

    await request(app.server)
      .post('/meal')
      .set('Cookie', cookies)
      .send(mockMeal)

    const meals = await request(app.server)
      .get('/meal')
      .set('Cookie', cookies)

    const firstMealId: string = meals.body[0].id

    const response = await request(app.server)
      .get(`/meal/${firstMealId}`)
      .set('Cookie', cookies)

    expect(response.statusCode).toBe(200)
    expect(response.body).toBeDefined()
  })

  it('should update meal by id', async () => {
    const mockUser = {
      email: 'test@example.com',
      password: 'test123'
    }

    const mockMeal = {
      name: 'McDonalds',
      description: 'Big Tasy + Milk Shake',
      isDietMeal: false
    }

    await request(app.server).post('/register').send(mockUser)
    const logIn = await request(app.server).post('/login').send(mockUser)

    const cookies = logIn.get('Set-Cookie')

    await request(app.server)
      .post('/meal')
      .set('Cookie', cookies)
      .send(mockMeal)

    const meals = await request(app.server)
      .get('/meal')
      .set('Cookie', cookies)

    const firstMealId: string = meals.body[0].id

    const mockNewMealData = {
      name: 'Bobs',
      description: 'Trio Double Cheese',
      isDietMeal: false
    }

    const response = await request(app.server)
      .put(`/meal/${firstMealId}`)
      .set('Cookie', cookies)
      .send(mockNewMealData)

    expect(response.statusCode).toBe(200)
    expect(response.body).toBeDefined()
  })

  it('should delete meal by id', async () => {
    const mockUser = {
      email: 'test@example.com',
      password: 'test123'
    }

    const mockMeal = {
      name: 'McDonalds',
      description: 'Big Tasy + Milk Shake',
      isDietMeal: false
    }

    await request(app.server).post('/register').send(mockUser)
    const logIn = await request(app.server).post('/login').send(mockUser)

    const cookies = logIn.get('Set-Cookie')

    await request(app.server)
      .post('/meal')
      .set('Cookie', cookies)
      .send(mockMeal)

    const meals = await request(app.server)
      .get('/meal')
      .set('Cookie', cookies)

    const firstMealId: string = meals.body[0].id

    const response = await request(app.server)
      .delete(`/meal/${firstMealId}`)
      .set('Cookie', cookies)

    expect(response.statusCode).toBe(200)
  })
})
