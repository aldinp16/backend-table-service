'use strict'

class MenuStore {
  get rules () {
    return {
      name: 'required',
      description: 'required',
      status: 'required|boolean',
      menu_pic: 'required|file|file_ext:png,jpg,jpeg,PNG,JPG,JPEG|file_size:10mb|file_types:image'
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

module.exports = MenuStore
