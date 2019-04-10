'use strict'

const User = use('App/Models/User')
const Order = use('App/Models/Order')
const Transaction = use('App/Models/Transaction')
const Menu = use('App/Models/Menu')
const Database = use('Database')

class DashboardController {
  async index ({ request, response }) {
    const [ orderCount, menuCount, userCount, transactionCount ] = await Promise.all([
      Order.getCount(),
      Menu.getCount(),
      User.getCount(),
      Transaction.getCount()
    ])

    return response.ok({
      status: 200,
      error: false,
      data: { orderCount, menuCount, userCount, transactionCount },
      message: null
    })
  }

  async transcationCountHistory ({ request, response }) {
    const transactions = await Database
      .raw(`
        SELECT
          YEAR(created_at) AS 'YEAR',
          MONTH(created_at) AS 'MONTH',
          DAY(created_at) AS 'DAY',
          SUM(total_price) AS 'TOTAL'
        FROM
          transactions
        GROUP BY
          DAY(created_at),
          MONTH(created_at),
          YEAR(created_at)
        ORDER BY DAY(created_at) DESC LIMIT 7
      `)
    return response.ok({
      status: 200,
      error: false,
      data: transactions[0],
      message: null
    })
  }

  async menuTopOrder ({ request, response }) {
    const menu = await Database
      .raw(`
        SELECT
          menus.id AS 'ID',
          menus.name AS 'NAME',
          sum(order_details.total) * menus.price AS 'TOTAL PRICE',
          sum(order_details.total) AS 'TOTAL'
        FROM
          menus,
          order_details
        WHERE
          menus.id = order_details.menu_id
        GROUP BY
          menus.id,
          menus.name
        ORDER BY
          TOTAL DESC LIMIT 10
      `)
    return response.ok({
      status: 200,
      error: false,
      data: menu[0],
      message: null
    })
  }
}

module.exports = DashboardController
