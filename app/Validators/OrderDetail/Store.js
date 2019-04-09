'use strict'

class OrderDetailStore {
  get rules () {
    return {
      order_id: 'required|integer'
    }
  }

  get sanitizationRules () {
    return {
      order_id: 'strip_tags'
    }
  }
}

module.exports = OrderDetailStore
