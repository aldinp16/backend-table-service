'use strict'

class UserUpdate {
  get rules () {
    return {
      email: 'email|unique:users,email'
    }
  }

  get sanitizationRules () {
    return {
      email: 'normalize_email|strip_tags'
    }
  }
}

module.exports = UserUpdate
