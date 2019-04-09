'use strict'

const Helpers = use('Helpers')

class ImageController {
  async index ({ response, params: { filename } }) {
    return response.download(Helpers.tmpPath(`uploads/${filename}`))
  }
}

module.exports = ImageController
