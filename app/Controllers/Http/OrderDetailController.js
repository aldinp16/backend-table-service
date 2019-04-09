'use strict'

const Order = use('App/Models/Order')

class OrderDetailController {
  async store ({ request, response, params: { id } }) {
    const order = await Order.findOrFail(id)
    await order
      .orderDetail()
      .where('id', request.input('order_id'))
      .update({ status: true })
    return response.ok({
      status: 200,
      error: false,
      data: null,
      message: 'Order detail status updated'
    })
  }
}

module.exports = OrderDetailController
