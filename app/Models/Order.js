'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Order extends Model {
  user () {
    return this.belongsTo('App/Models/User')
  }

  transaction () {
    return this.hasOne('App/Models/Transaction')
  }

  orderDetail () {
    return this.hasMany('App/Models/OrderDetail')
  }
}

module.exports = Order
