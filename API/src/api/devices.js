const Router = require('@koa/router')
const { Devices } = require('../models')

const { ifUser } = require('../middleware/auth')

const route = new Router({ prefix: '/devices' })
  
route.post('/', ifUser, async (ctx) => {
  ctx.noContent()
})

module.exports = route
