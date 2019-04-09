'use strict'

class TransactionsStore {
  get rules () {
    return {
      total_paid: 'required|integer'
    }
  }

  get sanitizationRules () {
    return {
      total_paid: 'strip_tags'
    }
  }
}

module.exports = TransactionsStore
