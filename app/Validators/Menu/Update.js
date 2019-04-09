'use strict'

class MenuUpdate {
  get rules () {
    return {
      status: 'boolean'
    }
  }

  get sanitizationRules () {
    return {
      name: 'strip_tags',
      description: 'strip_tags',
      status: 'strip_tags'
    }
  }
}

module.exports = MenuUpdate
