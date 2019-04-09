'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('/auth', 'AuthController.login')
  .middleware(['guest'])
  .validator('Auth/Store')

Route.resource('users', 'UserController')
  .apiOnly()
  .middleware(new Map([
    [['index'], ['auth', 'role:administrator']],
    [['store'], ['auth', 'role:administrator,kasir,waiter']],
    [['show'], ['auth', 'role:all']],
    [['update'], ['auth', 'role:administrator']],
    [['destroy'], ['auth', 'role:administrator']]
  ]))
  .validator(new Map([
    [['users.store'], ['User/Store']],
    [['users.update'], ['User/Update']]
  ]))

Route.resource('menus', 'MenuController')
  .apiOnly()
  .middleware(new Map([
    [['index'], ['auth', 'role:all']],
    [['store'], ['auth', 'role:administrator']],
    [['show'], ['auth', 'role:all']],
    [['update'], ['auth', 'role:administrator']],
    [['destroy'], ['auth', 'role:administrator']]
  ]))
  .validator(new Map([
    [['menus.store'], ['Menu/Store']],
    [['menus.update'], ['Menu/Update']]
  ]))

Route.resource('orders', 'OrderController')
  .apiOnly()
  .except(['update'])
  .middleware(new Map([
    [['index'], ['auth', 'role:all']],
    [['store'], ['auth', 'role:administrator,waiter,pelanggan']],
    [['show'], ['auth', 'role:all']],
    [['destroy'], ['auth', 'role:administrator']]
  ]))
  .validator(new Map([
    [['orders.store'], ['Order/Store']]
  ]))

Route.group(() => {
  Route.post('/transactions', 'TransactionController.store')
    .middleware(['auth', 'role:administrator,kasir'])
    .validator('Transaction/Store')
  Route.post('/updateOrderDetailStatus', 'OrderDetailController.store')
    .middleware(['auth', 'role:administrator,waiter'])
    .validator('OrderDetail/Store')
}).prefix('orders/:id')

Route.get('image/:filename', 'ImageController.index')
