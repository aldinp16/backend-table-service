'use strict'

/*
|--------------------------------------------------------------------------
| MenuSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Menu = use('App/Models/Menu')

class MenuSeeder {
  async run () {
    await Menu.createMany([
      {
        name: 'Tumis Labu Siam',
        description: 'Tumis labu siam adalah masakan yang sering disajikan dirumah-rumah, Anda bisa menyantapnya dengan sepiring nasi putih hangat.',
        price: 12000,
        status: true
      },
      {
        name: 'Capcay Goreng Bakso',
        description: 'Ingin menikmati berbagai macam sayuran dalam satu piring? Capcay goreng bakso bisa dijadikan menu piliha Anda.',
        price: 15000,
        status: false
      },
      {
        name: 'Tumis Kangkung',
        description: 'Tumis kangkung adalah masakan yang murah meriah tetapi kelezatannya tidak diragukan lagi.',
        price: 8000,
        status: false
      },
      {
        name: 'Terong Balado',
        description: 'Satu buah terong ungu bisa Anda olah dengan kelezatan yang oke punya.',
        price: 10000,
        status: true
      }
    ])
  }
}

module.exports = MenuSeeder
