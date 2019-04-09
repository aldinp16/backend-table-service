'use strict'

const User = use('App/Models/User')

class AuthController {
  async login ({ request, response, auth }) {
    const { email, password } = request.post()

    const user = await User.findBy('email', email)
    if (user === null) {
      return response.unauthorized({
        status: 401,
        error: true,
        data: null,
        message: 'Invalid email or password'
      })
    }

    await user.load('level')
    const userJSON = user.toJSON()
    delete userJSON.password
    const token = await auth.attempt(email, password, userJSON)
    return response.ok({
      status: 200,
      error: false,
      data: token,
      message: 'Login successfully'
    })
  }
}

module.exports = AuthController
