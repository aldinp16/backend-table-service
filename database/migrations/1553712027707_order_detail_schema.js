'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderDetailSchema extends Schema {
  up () {
    this.create('order_details', (table) => {
      table.increments()
      table.integer('order_id').unsigned()
      table.integer('menu_id').unsigned()
      table.integer('total').unsigned()
      table.string('description')
      table.boolean('status').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('order_details')
  }
}

module.exports = OrderDetailSchema
