'use strict'

class OrderStore {
  get rules () {
    return {
      no_table: 'required|integer',
      items: 'required|array'
    }
  }

  get sanitizationRules () {
    return {
      no_table: 'strip_tags',
      order_description: 'strip_tags'
    }
  }
}

module.exports = OrderStore
