'use strict'

const Menu = use('App/Models/Menu')
const Helpers = use('Helpers')

class MenuController {
  async $storeImage (request) {
    const menuImage = request.file('menu_pic', { types: ['image'], size: '2mb' })
    const fileName = `${new Date().getTime()}.${menuImage.subtype}`
    await menuImage.move(Helpers.tmpPath('uploads'), { name: fileName })
    return fileName
  }

  async index ({ request, response }) {
    const menus = await Menu.all()

    return response.ok({
      status: 200,
      error: false,
      data: menus,
      message: null
    })
  }

  async store ({ request, response }) {
    const menuData = request.only(['name', 'price', 'description', 'status'])
    menuData.image = await this.$storeImage(request)
    const menu = await Menu.create(menuData)

    return response.ok({
      status: 200,
      error: false,
      data: menu,
      message: 'Menu added'
    })
  }

  async show ({ request, response, params: { id } }) {
    const menu = await Menu.findOrFail(id)

    return response.ok({
      status: 200,
      error: false,
      data: menu,
      message: null
    })
  }

  async update ({ request, response, params: { id } }) {
    const menu = await Menu.findOrFail(id)

    const menuData = request.only(['name', 'price', 'description', 'status'])
    if (request.file('menu_pic')) {
      menuData.image = await this.$storeImage(request)
    }

    menu.merge(menuData)
    await menu.save()

    return response.ok({
      status: 200,
      error: false,
      data: menu,
      message: 'Menu updated'
    })
  }

  async destroy ({ request, response, params: { id } }) {
    const menu = await Menu.findOrFail(id)
    await menu.delete()

    return response.ok({
      status: 200,
      error: false,
      data: null,
      message: 'Menu deleted'
    })
  }
}

module.exports = MenuController
