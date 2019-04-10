'use strict'

const { test, trait } = use('Test/Suite')('Order')
const Factory = use('Factory')
const Level = use('App/Models/Level')

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')
trait('DatabaseTransactions')

test('User can create order because level is in role list', async ({ client }) => {
  const levelPromise = Level.create({ name: 'pelanggan' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const menuPromise = Factory.model('App/Models/Menu').createMany(5)
  const [ level, user, menu ] = await Promise.all([levelPromise, userPromise, menuPromise])
  await user.level().associate(level)

  const response = await client
    .post('/orders')
    .loginVia(user)
    .send({
      order_description: 'is order description',
      no_table: 1,
      items: [{ menu_id: menu[0].id, total: 10, description: 'order detail description' }]
    })
    .end()

  response.assertStatus(200)
  response.assertJSON({
    status: 200,
    error: false,
    data: null,
    message: 'Order created'
  })
})

test('User can\'t create order because level is not in role list', async ({ client }) => {
  const levelPromise = Level.create({ name: 'kasir' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const menuPromise = Factory.model('App/Models/Menu').createMany(5)
  const [ level, user, menu ] = await Promise.all([levelPromise, userPromise, menuPromise])
  await user.level().associate(level)

  const response = await client
    .post('/orders')
    .loginVia(user)
    .send({
      order_description: 'is order description',
      no_table: 1,
      items: [{ menu_id: menu[0].id, total: 10, description: 'order detail description' }]
    })
    .end()

  response.assertStatus(401)
  response.assertError({
    status: 401,
    error: true,
    data: null,
    message: 'Unauthorize Access'
  })
})

test('User can delete order because level is administrator', async ({ client }) => {
  const levelPromise = Level.create({ name: 'administrator' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const menuPromise = Factory.model('App/Models/Menu').create()
  const [ level, user, menu ] = await Promise.all([levelPromise, userPromise, menuPromise])

  const order = await Factory.model('App/Models/Order').create()
  const orderDetail = await Factory.model('App/Models/OrderDetail').create()

  await Promise.all([
    user.level().associate(level),
    orderDetail.menu().associate(menu),
    orderDetail.order().associate(order)
  ])

  const response = await client
    .delete(`/orders/${order.id}`)
    .loginVia(user)
    .end()

  response.assertStatus(200)
  response.assertJSON({
    status: 200,
    error: true,
    data: null,
    message: 'Order destroyed'
  })
})

test('User can\'t delete order because level is not administrator', async ({ client }) => {
  const levelPromise = Level.create({ name: 'pelanggan' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const menuPromise = Factory.model('App/Models/Menu').create()
  const [ level, user, menu ] = await Promise.all([levelPromise, userPromise, menuPromise])

  const order = await Factory.model('App/Models/Order').create()
  const orderDetail = await Factory.model('App/Models/OrderDetail').create()

  await Promise.all([
    user.level().associate(level),
    orderDetail.menu().associate(menu),
    orderDetail.order().associate(order)
  ])

  const response = await client
    .delete(`/orders/${order.id}`)
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

test('User can view all order list because level is not pelanggan', async ({ client }) => {
  const levelPromise = Level.create({ name: 'administrator' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const menuPromise = Factory.model('App/Models/Menu').create()
  const [ level, user, menu ] = await Promise.all([levelPromise, userPromise, menuPromise])

  const order = await Factory.model('App/Models/Order').create()
  const orderDetail = await Factory.model('App/Models/OrderDetail').create()

  await Promise.all([
    user.level().associate(level),
    orderDetail.menu().associate(menu),
    orderDetail.order().associate(order)
  ])

  const response = await client
    .get(`/orders`)
    .loginVia(user)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    status: 200,
    error: false,
    data: []
  })
})

test('User can view only own history order list because level is pelanggan', async ({ client }) => {
  const levelPromise = Level.create({ name: 'pelanggan' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const menuPromise = Factory.model('App/Models/Menu').create()
  const [ level, user, menu ] = await Promise.all([levelPromise, userPromise, menuPromise])

  const order = await Factory.model('App/Models/Order').create()
  const orderDetail = await Factory.model('App/Models/OrderDetail').create()

  await Promise.all([
    user.level().associate(level),
    order.user().associate(user),
    orderDetail.menu().associate(menu),
    orderDetail.order().associate(order)
  ])

  const response = await client
    .get(`/orders`)
    .loginVia(user)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    status: 200,
    error: false,
    data: [{ user_id: user.id }]
  })
})

test('User can process detail order because is waiter', async ({ client }) => {
  const levelPromise = Level.create({ name: 'waiter' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const menuPromise = Factory.model('App/Models/Menu').create()
  const [ level, user, menu ] = await Promise.all([levelPromise, userPromise, menuPromise])

  const order = await Factory.model('App/Models/Order').create()
  const orderDetail = await Factory.model('App/Models/OrderDetail').create()

  await Promise.all([
    user.level().associate(level),
    orderDetail.menu().associate(menu),
    orderDetail.order().associate(order)
  ])

  const response = await client
    .post(`/orders/${order.id}/updateOrderDetailStatus`)
    .loginVia(user)
    .send({ order_id: orderDetail.id })
    .end()

  response.assertStatus(200)
  response.assertJSON({
    status: 200,
    error: false,
    data: null,
    message: 'Order detail status updated'
  })
})

test('User can\'t process detail order because is not waiter', async ({ client }) => {
  const levelPromise = Level.create({ name: 'pelanggan' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const menuPromise = Factory.model('App/Models/Menu').create()
  const [ level, user, menu ] = await Promise.all([levelPromise, userPromise, menuPromise])

  const order = await Factory.model('App/Models/Order').create()
  const orderDetail = await Factory.model('App/Models/OrderDetail').create()

  await Promise.all([
    user.level().associate(level),
    orderDetail.menu().associate(menu),
    orderDetail.order().associate(order)
  ])

  const response = await client
    .post(`/orders/${order.id}/updateOrderDetailStatus`)
    .loginVia(user)
    .send({ order_id: orderDetail.id })
    .end()

  response.assertStatus(401)
  response.assertError({
    status: 401,
    error: true,
    data: null,
    message: 'Unauthorize Access'
  })
})

test('User can process detail order because is kasir', async ({ client }) => {
  const levelPromise = Level.create({ name: 'kasir' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const menuPromise = Factory.model('App/Models/Menu').create()
  const [ level, user, menu ] = await Promise.all([levelPromise, userPromise, menuPromise])

  const order = await Factory.model('App/Models/Order').create()
  const orderDetail = await Factory.model('App/Models/OrderDetail').create()
  const anotherUser = await Factory.model('App/Models/User').create()

  await Promise.all([
    order.user().associate(anotherUser),
    user.level().associate(level),
    orderDetail.menu().associate(menu),
    orderDetail.order().associate(order)
  ])

  const response = await client
    .post(`/orders/${order.id}/transactions`)
    .loginVia(user)
    .send({ total_paid: 500000 })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    status: 200,
    error: false,
    data: { total_paid: 500000 },
    message: 'Transaction success'
  })
})

test('User can\'t process detail order because is not kasir', async ({ client }) => {
  const levelPromise = Level.create({ name: 'waiter' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const menuPromise = Factory.model('App/Models/Menu').create()
  const [ level, user, menu ] = await Promise.all([levelPromise, userPromise, menuPromise])

  const order = await Factory.model('App/Models/Order').create()
  const orderDetail = await Factory.model('App/Models/OrderDetail').create()

  await Promise.all([
    user.level().associate(level),
    orderDetail.menu().associate(menu),
    orderDetail.order().associate(order)
  ])

  const response = await client
    .post(`/orders/${order.id}/transactions`)
    .loginVia(user)
    .send({ total_paid: 500000 })
    .end()

  response.assertStatus(401)
  response.assertError({
    status: 401,
    error: true,
    data: null,
    message: 'Unauthorize Access'
  })
})

test('User can\'t view detail order from another user because level is pelanggan', async ({ client }) => {
  const levelPromise = Level.create({ name: 'pelanggan' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const menuPromise = Factory.model('App/Models/Menu').create()
  const [ level, user, menu ] = await Promise.all([levelPromise, userPromise, menuPromise])

  const order = await Factory.model('App/Models/Order').create()
  const orderDetail = await Factory.model('App/Models/OrderDetail').create()

  await Promise.all([
    user.level().associate(level),
    orderDetail.menu().associate(menu),
    orderDetail.order().associate(order)
  ])

  const response = await client
    .get(`/orders/${order.id}`)
    .loginVia(user)
    .end()

  response.assertStatus(404)
  response.assertError({
    status: 404,
    error: true,
    data: null,
    message: 'Order Not Found'
  })
})

test('User can only view own detail order because level is pelanggan', async ({ client }) => {
  const levelPromise = Level.create({ name: 'pelanggan' })
  const userPromise = Factory.model('App/Models/User').create({ password: 'secret' })
  const menuPromise = Factory.model('App/Models/Menu').create()
  const [ level, user, menu ] = await Promise.all([levelPromise, userPromise, menuPromise])

  const order = await Factory.model('App/Models/Order').create()
  const orderDetail = await Factory.model('App/Models/OrderDetail').create()

  await Promise.all([
    user.level().associate(level),
    order.user().associate(user),
    orderDetail.menu().associate(menu),
    orderDetail.order().associate(order)
  ])

  const response = await client
    .get(`/orders/${order.id}`)
    .loginVia(user)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    status: 200,
    error: false,
    data: { user_id: user.id },
    message: null
  })
})
