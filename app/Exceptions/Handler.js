'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle (error, { request, response }) {
    switch (error.name) {
      case 'HttpException': return response.status(error.status).send({
        status: error.status,
        error: true,
        data: null,
        message: error.message
      })
      case 'InvalidJwtToken': return response.unauthorized({
        status: 401,
        error: true,
        data: null,
        message: 'Unauthorize Access'
      })
      case 'ModelNotFoundException': return response.notFound({
        status: 404,
        error: true,
        data: null,
        message: `${error.message.split(' ')[6]} Not Found`
      })
      case 'PasswordMisMatchException': return response.unauthorized({
        status: 401,
        error: true,
        data: null,
        message: 'Invalid email or password'
      })
      case 'UserNotFoundException': return response.unauthorized({
        status: 401,
        error: true,
        data: null,
        message: 'Invalid email or password'
      })
      case 'ValidationException': return response.badRequest({
        status: 400,
        error: true,
        data: error.messages,
        message: 'Validaton error'
      })
    }

    return response.status(error.status).send(error.message)
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  // async report (error, { request }) {
  // }
}

module.exports = ExceptionHandler
