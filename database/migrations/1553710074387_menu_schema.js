'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MenuSchema extends Schema {
  up () {
    this.create('menus', (table) => {
      table.increments()
      table.string('name', 80).notNullable()
      table.string('image')
      table.decimal('price')
      table.string('description')
      table.boolean('status')
      table.timestamps()
    })
  }

  down () {
    this.drop('menus')
  }
}

module.exports = MenuSchema
