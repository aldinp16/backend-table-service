'use strict'

class UserStore {
  get rules () {
    return {
      fullname: 'required',
      username: 'required|unique:users,username',
      email: 'required|email|unique:users,email',
      password: 'required'
    }
  }

  get sanitizationRules () {
    return {
      fullname: 'strip_tags',
      username: 'strip_tags',
      email: 'normalize_email|strip_tags'
    }
  }

  get messages () {
    return {
      'fullname.required': 'fullname can\'t be empty',
      'username.required': 'username can\'t be empty',
      'email.required': 'email can\'t be empty',
      'password.required': 'password can\'t be empty',
      'username.unique': 'username already used',
      'email.unique': 'email already used'
    }
  }
}

module.exports = UserStore
