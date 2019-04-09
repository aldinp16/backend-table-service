'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Role {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response, auth }, next, properties) {
    const user = auth.current.user
    await user.load('level')

    if (properties.includes(user.$relations.level.name) || properties[0] === 'all') {
      return next()
    }

    return response.unauthorized({
      status: 401,
      error: true,
      data: null,
      message: 'Unauthorize Access'
    })
  }
}

module.exports = Role
