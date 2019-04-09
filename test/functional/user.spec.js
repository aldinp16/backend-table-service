'use strict'

const { test, trait } = use('Test/Suite')('User')
const Factory = use('Factory')
const Level = use('App/Models/Level')

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')
trait('DatabaseTransactions')

test('User can create another user because level is in role list', async ({ client }) => {
  const levelPromise = Level.create({ name: 'administrator' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const [ level, user ] = await Promise.all([ levelPromise, userPromise ])
  await user.level().associate(level)

  const userModel = (await Factory.model('App/Models/User').make()).toJSON()
  await Level.create({ name: 'pelanggan' })

  const response = await client
    .post('/users')
    .loginVia(user)
    .send(Object.assign({ ...userModel, level: 'pelanggan' }, { password: 'secret' }))
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    status: 200,
    error: false,
    data: { fullname: userModel.fullname },
    message: 'User created'
  })
})

test('User can\'t create another user because level is not in role list', async ({ client }) => {
  const levelPromise = Level.create({ name: 'owner' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const [ level, user ] = await Promise.all([ levelPromise, userPromise ])
  await user.level().associate(level)

  const userModel = (await Factory.model('App/Models/User').make()).toJSON()
  await Level.create({ name: 'pelanggan' })

  const response = await client
    .post('/users')
    .loginVia(user)
    .send(Object.assign({ ...userModel, level: 'pelanggan' }, { password: 'secret' }))
    .end()

  response.assertStatus(401)
  response.assertError({
    status: 401,
    error: true,
    data: null,
    message: 'Unauthorize Access'
  })
})

test('User can update another user data because level is administrator', async ({ client }) => {
  const levelPromise = Level.create({ name: 'administrator' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const [ level, user ] = await Promise.all([ levelPromise, userPromise ])
  await user.level().associate(level)

  const anotherUser = await Factory.model('App/Models/User').create()

  const response = await client
    .put(`/users/${anotherUser.id}`)
    .loginVia(user)
    .send({ fullname: 'fullnameChanged' })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    status: 200,
    error: false,
    data: { fullname: 'fullnameChanged' },
    message: 'User updated'
  })
})

test('User can\'t update another user data because level is not administrator', async ({ client }) => {
  const levelPromise = Level.create({ name: 'waiter' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const [ level, user ] = await Promise.all([ levelPromise, userPromise ])
  await user.level().associate(level)

  const anotherUser = await Factory.model('App/Models/User').create()

  const response = await client
    .put(`/users/${anotherUser.id}`)
    .loginVia(user)
    .send({ fullname: 'fullnameChanged' })
    .end()

  response.assertStatus(401)
  response.assertError({
    status: 401,
    error: true,
    data: null,
    message: 'Unauthorize Access'
  })
})

test('User can delete another user because level is administrator', async ({ client }) => {
  const levelPromise = Level.create({ name: 'administrator' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const [ level, user ] = await Promise.all([ levelPromise, userPromise ])
  await user.level().associate(level)

  const anotherUser = await Factory.model('App/Models/User').create()

  const response = await client
    .delete(`/users/${anotherUser.id}`)
    .loginVia(user)
    .end()

  response.assertStatus(200)
  response.assertJSON({
    status: 200,
    error: false,
    data: null,
    message: 'User deleted'
  })
})

test('User can\'t delete another user because level is not administrator', async ({ client }) => {
  const levelPromise = Level.create({ name: 'waiter' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const [ level, user ] = await Promise.all([ levelPromise, userPromise ])
  await user.level().associate(level)

  const anotherUser = await Factory.model('App/Models/User').create()

  const response = await client
    .delete(`/users/${anotherUser.id}`)
    .loginVia(user)
    .end()

  response.assertStatus(401)
  response.assertError({
    status: 401,
    error: true,
    data: null,
    message: 'Unauthorize Access'
  })
})

test('User can view another user profile because level is administrator', async ({ client }) => {
  const levelPromise = Level.create({ name: 'administrator' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const [ level, user ] = await Promise.all([ levelPromise, userPromise ])
  await user.level().associate(level)

  const anotherUser = await Factory.model('App/Models/User').create()

  const response = await client
    .get(`/users/${anotherUser.id}`)
    .loginVia(user)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    status: 200,
    error: false,
    data: { id: anotherUser.id },
    message: null
  })
})

test('User can\'t view another user profile because level is not administrator', async ({ client }) => {
  const levelPromise = Level.create({ name: 'pelanggan' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const [ level, user ] = await Promise.all([ levelPromise, userPromise ])
  await user.level().associate(level)

  const anotherUser = await Factory.model('App/Models/User').create()

  const response = await client
    .get(`/users/${anotherUser.id}`)
    .loginVia(user)
    .end()

  response.assertStatus(404)
  response.assertError({
    status: 404,
    error: true,
    data: null,
    message: 'User Not Found'
  })
})
