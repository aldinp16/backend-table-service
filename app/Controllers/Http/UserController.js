'use strict'

const User = use('App/Models/User')
const Level = use('App/Models/Level')

class UserController {
  async index ({ request, response }) {
    const users = await User
      .query()
      .with('level')
      .fetch()

    return response.ok({
      status: 200,
      error: false,
      data: users,
      message: null
    })
  }

  async store ({ request, response, auth }) {
    let dataLevel = request.input('level')
    const isAdmin = auth.current.user.$relations.level.name === 'administrator'
    if (!isAdmin) {
      dataLevel = 'pelanggan'
    }

    const level = await Level.findByOrFail('name', dataLevel)
    const user = await User.create(request.only(['fullname', 'username', 'email', 'password']))
    await user.level().associate(level)

    return response.ok({
      status: 200,
      error: false,
      data: user,
      message: 'User created'
    })
  }

  async show ({ request, response, auth, params: { id } }) {
    const user = await User.findOrFail(id)

    const isOwn = auth.current.user.id === user.id
    const isAdmin = auth.current.user.$relations.level.name === 'administrator'
    if (!isOwn && !isAdmin) {
      return response.notFound({
        status: 404,
        error: true,
        data: null,
        message: 'User Not Found'
      })
    }

    return response.ok({
      status: 200,
      error: false,
      data: user,
      message: null
    })
  }

  async update ({ request, response, params: { id } }) {
    const user = await User.findOrFail(id)

    if (request.input('level')) {
      const level = await Level.findByOrFail('name', request.input('level'))
      await user.level().associate(level)
    }

    user.merge(request.only(['fullname', 'email', 'password']))
    await user.save()

    return response.ok({
      status: 200,
      error: false,
      data: user,
      message: 'User updated'
    })
  }

  async destroy ({ request, response, params: { id } }) {
    const user = await User.findOrFail(id)
    await user.delete()

    return response.ok({
      status: 200,
      error: false,
      data: null,
      message: 'User deleted'
    })
  }
}

module.exports = UserController
