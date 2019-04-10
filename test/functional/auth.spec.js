'use strict'

const { test, trait } = use('Test/Suite')('Auth')
const Factory = use('Factory')
const Level = use('App/Models/Level')

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')
trait('DatabaseTransactions')

test('User can auth with email and password', async ({ client }) => {
  const levelPromise = Level.create({ name: 'administrator' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const [ level, user ] = await Promise.all([levelPromise, userPromise])
  await user.level().associate(level)

  const response = await client
    .post('/auth')
    .send({ email: user.email, password: 'secret' })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    status: 200,
    error: false,
    message: 'Login successfully'
  })
}).timeout(0)

test('User can\'t auth because incorect email or password', async ({ client }) => {
  const response = await client
    .post('/auth')
    .send({ email: 'incorrentEmail@email.com', password: 'incorectPassword' })
    .end()

  response.assertStatus(401)
  response.assertError({
    status: 401,
    error: true,
    data: null,
    message: 'Invalid email or password'
  })
}).timeout(0)

test('User can\'t auth because validation error', async ({ client }) => {
  const response = await client
    .post('/auth')
    .send({ email: 'notvalidemail', password: 'secret' })
    .end()

  response.assertStatus(400)
  response.assertError({
    status: 400,
    error: true,
    data: [{
      'message': 'email validation failed on email',
      'field': 'email',
      'validation': 'email'
    }],
    message: 'Validaton error'
  })
}).timeout(0)
