'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const User = use('App/Models/User')
const Level = use('App/Models/Level')

class UserSeeder {
  async run () {
    await Level.createMany([
      { id: 1, name: 'administrator' },
      { id: 2, name: 'waiter' },
      { id: 3, name: 'kasir' },
      { id: 4, name: 'owner' },
      { id: 5, name: 'pelanggan' }
    ])

    await User.createMany([
      {
        fullname: 'Aldi Nugraha',
        username: 'aldinp16',
        email: 'me@aldi.dev',
        password: 'administrator',
        level_id: 1
      },
      {
        fullname: 'Nama Waiter',
        username: 'waiter',
        email: 'waiter@aldi.dev',
        password: 'waiter',
        level_id: 2
      },
      {
        fullname: 'Nama Kasir',
        username: 'kasir',
        email: 'kasir@aldi.dev',
        password: 'kasir',
        level_id: 3
      },
      {
        fullname: 'Nama Owner',
        username: 'owner',
        email: 'owner@aldi.dev',
        password: 'owner',
        level_id: 4
      },
      {
        fullname: 'Nama Pelanggan',
        username: 'pelanggan',
        email: 'pelanggan@aldi.dev',
        password: 'pelanggan',
        level_id: 5
      }
    ])
  }
}

module.exports = UserSeeder
