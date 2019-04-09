'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

Factory.blueprint('App/Models/User', (faker, index, data) => {
  const defaultValue = {
    fullname: faker.name(),
    username: faker.username(),
    email: faker.email(),
    password: 'secret'
  }
  return Object.assign(defaultValue, data)
})

Factory.blueprint('App/Models/Menu', (faker, index, data) => {
  const defaultValue = {
    name: faker.word(),
    image: faker.url({ domain: 'aldi.dev', path: 'image', extensions: ['jpg'] }),
    price: faker.natural({ min: 5000, max: 10000 }),
    description: faker.sentence(),
    status: true
  }
  return Object.assign(defaultValue, data)
})

Factory.blueprint('App/Models/Order', (faker, index, data) => {
  const defaultValue = {
    description: faker.sentence(),
    no_table: faker.natural({ min: 1, max: 20 }),
    status: false
  }
  return Object.assign(defaultValue, data)
})

Factory.blueprint('App/Models/OrderDetail', (faker, index, data) => {
  const defaultValue = {
    total: faker.natural({ min: 1, max: 10 }),
    description: faker.sentence(),
    status: false
  }
  return Object.assign(defaultValue, data)
})
