'use strict'

const { test, trait } = use('Test/Suite')('Menu')
const Factory = use('Factory')
const Level = use('App/Models/Level')
const Helpers = use('Helpers')

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')
trait('DatabaseTransactions')

test('User can create menu because level is administrator', async ({ client }) => {
  const levelPromise = Level.create({ name: 'administrator' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const menuPromise = Factory.model('App/Models/Menu').make()
  const [ level, user, menu ] = await Promise.all([ levelPromise, userPromise, menuPromise ])
  await user.level().associate(level)

  const response = await client
    .post('/menus')
    .loginVia(user)
    .field('name', menu.name)
    .field('price', menu.price)
    .field('description', menu.description)
    .field('status', menu.status ? 1 : 0)
    .attach('menu_pic', Helpers.publicPath('example.png'))
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    status: 200,
    error: false,
    data: { name: menu.name },
    message: 'Menu added'
  })
}).timeout(0)

test('User can\'t create menu because level is no administrator', async ({ client }) => {
  const levelPromise = Level.create({ name: 'waiter' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const menuPromise = Factory.model('App/Models/Menu').make()
  const [ level, user, menu ] = await Promise.all([ levelPromise, userPromise, menuPromise ])
  await user.level().associate(level)

  const response = await client
    .post('/menus')
    .loginVia(user)
    .field('name', menu.name)
    .field('price', menu.price)
    .field('description', menu.description)
    .field('status', menu.status ? 1 : 0)
    .attach('menu_pic', Helpers.publicPath('example.png'))
    .end()

  response.assertStatus(401)
  response.assertError({
    status: 401,
    error: true,
    data: null,
    message: 'Unauthorize Access'
  })
}).timeout(0)

test('User can delete menu because level is administrator', async ({ client }) => {
  const levelPromise = Level.create({ name: 'administrator' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const menuPromise = Factory.model('App/Models/Menu').create()
  const [ level, user, menu ] = await Promise.all([ levelPromise, userPromise, menuPromise ])
  await user.level().associate(level)

  const response = await client
    .delete(`/menus/${menu.id}`)
    .loginVia(user)
    .end()

  response.assertStatus(200)
  response.assertJSON({
    status: 200,
    error: false,
    data: null,
    message: 'Menu deleted'
  })
}).timeout(0)

test('User can\'t delete menu because level is not administrator', async ({ client }) => {
  const levelPromise = Level.create({ name: 'waiter' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const menuPromise = Factory.model('App/Models/Menu').create()
  const [ level, user, menu ] = await Promise.all([ levelPromise, userPromise, menuPromise ])
  await user.level().associate(level)

  const response = await client
    .delete(`/menus/${menu.id}`)
    .loginVia(user)
    .end()

  response.assertStatus(401)
  response.assertError({
    status: 401,
    error: true,
    data: null,
    message: 'Unauthorize Access'
  })
}).timeout(0)

test('User can update menu because level is administrator', async ({ client }) => {
  const levelPromise = Level.create({ name: 'administrator' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const menuPromise = Factory.model('App/Models/Menu').create()
  const [ level, user, menu ] = await Promise.all([ levelPromise, userPromise, menuPromise ])
  await user.level().associate(level)

  const response = await client
    .put(`/menus/${menu.id}`)
    .loginVia(user)
    .send({ name: 'menunamechanged' })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    status: 200,
    error: false,
    data: { name: 'menunamechanged' }
  })
}).timeout(0)

test('User can\'t update menu because level is not administrator', async ({ client }) => {
  const levelPromise = Level.create({ name: 'waiter' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const menuPromise = Factory.model('App/Models/Menu').create()
  const [ level, user, menu ] = await Promise.all([ levelPromise, userPromise, menuPromise ])
  await user.level().associate(level)

  const response = await client
    .put(`/menus/${menu.id}`)
    .loginVia(user)
    .send({ name: 'menunamechanged' })
    .end()

  response.assertStatus(401)
  response.assertError({
    status: 401,
    error: true,
    data: null,
    message: 'Unauthorize Access'
  })
}).timeout(0)

test('User can view menu list', async ({ client }) => {
  const levelPromise = Level.create({ name: 'waiter' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const menusPromise = Factory.model('App/Models/Menu').createMany(10)
  const [ level, user ] = await Promise.all([ levelPromise, userPromise, menusPromise ])
  await user.level().associate(level)

  const response = await client
    .get('/menus')
    .loginVia(user)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    status: 200,
    error: false,
    data: [],
    message: null
  })
}).timeout(0)

test('User can view menu detail', async ({ client }) => {
  const levelPromise = Level.create({ name: 'waiter' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const menuPromise = Factory.model('App/Models/Menu').create()
  const [ level, user, menu ] = await Promise.all([ levelPromise, userPromise, menuPromise ])
  await user.level().associate(level)

  const response = await client
    .get(`/menus/${menu.id}`)
    .loginVia(user)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    status: 200,
    error: false,
    data: { id: menu.id, name: menu.name },
    message: null
  })
}).timeout(0)
