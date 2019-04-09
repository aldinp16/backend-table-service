'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TransactionSchema extends Schema {
  up () {
    this.create('transactions', (table) => {
      table.increments()
      table.integer('order_id').unsigned()
      table.integer('user_id').unsigned()
      table.decimal('total_price')
      table.decimal('total_paid')
      table.timestamps()
    })
  }

  down () {
    this.drop('transactions')
  }
}

module.exports = TransactionSchema
