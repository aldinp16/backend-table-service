'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class OrderDetail extends Model {
  order () {
    return this.belongsTo('App/Models/Order')
  }
  menu () {
    return this.belongsTo('App/Models/Menu')
  }
}

module.exports = OrderDetail
