'use strict'

const Order = use('App/Models/Order')
const Database = use('Database')

class OrderController {
  async index ({ request, response, auth }) {
    let orders = Order
      .query()
      .with('user')
      .with('orderDetail')
      .with('transaction')

    const isPelanggan = auth.current.user.$relations.level.name === 'pelanggan'
    if (isPelanggan) {
      orders.where({ user_id: auth.current.user.id })
    }

    orders = await orders.fetch()
    return response.ok({
      status: 200,
      error: false,
      data: orders,
      message: null
    })
  }

  async store ({ request, response, auth }) {
    const user = auth.current.user
    const orderData = request.only(['order_description', 'no_table'])

    const trx = await Database.beginTransaction()
    const order = await user
      .order()
      .create({
        description: orderData.order_description,
        no_table: orderData.no_table
      }, trx)
    await order
      .orderDetail()
      .createMany(request.input(['items']), trx)
    await trx.commit()

    return response.ok({
      status: 200,
      error: false,
      data: null,
      message: 'Order created'
    })
  }

  async show ({ request, response, auth, params: { id } }) {
    const user = auth.current.user
    const order = await Order.findOrFail(id)
    await order.loadMany(['user', 'transaction', 'orderDetail.menu'])

    const isOwn = user.id === order.user_id
    const isAdmin = user.$relations.level.name !== 'pelanggan'
    if (!isOwn && !isAdmin) {
      return response.notFound({
        status: 404,
        error: true,
        data: null,
        message: 'Order Not Found'
      })
    }

    return response.ok({
      status: 200,
      error: false,
      data: order,
      message: null
    })
  }

  async destroy ({ request, response, auth, params: { id } }) {
    const order = await Order.findOrFail(id)
    await order.delete()

    return response.ok({
      status: 200,
      error: true,
      data: null,
      message: 'Order destroyed'
    })
  }
}

module.exports = OrderController
