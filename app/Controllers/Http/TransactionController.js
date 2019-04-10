'use strict'

const User = use('App/Models/User')
const Transaction = use('App/Models/Transaction')
const Order = use('App/Models/Order')
const Database = use('Database')

class TransactionController {
  async store ({ request, response, auth, params: { id } }) {
    const order = await Order.findOrFail(id)
    const user = await User.findOrFail(order.user_id)
    await order.load('orderDetail.menu')
    const orderJSON = order.toJSON()

    const globalTrx = Database.connection('mysql')._globalTrx
    const trx = globalTrx || await Database.beginTransaction()
    order.status = 1
    const transaction = new Transaction()
    transaction.total_price = orderJSON.orderDetail
      .map((item) => item.total * item.menu.price)
      .reduce((a, b) => a + b, 0)
    transaction.total_paid = request.input('total_paid')
    await order.save()
    await transaction.save()
    await transaction.user().associate(user)
    await transaction.order().associate(order)
    if (!globalTrx) {
      await trx.commit()
    }

    return response.ok({
      status: 200,
      error: false,
      data: transaction,
      message: 'Transaction success'
    })
  }
}

module.exports = TransactionController
