const Router = require('@koa/router')
const route = new Router({ prefix: '/users' })

const { Users } = require('../models')
const { ifUser } = require('../middleware/auth')
const { HttpError } = require('../utils/errors')
const { NOT_FOUND } = require('../utils/statusCodes')
  
route.get('/', ifUser, async (ctx) => {
  const user = await Users.query().findById(ctx.user.id).select('id', 'email', 'fullName')
  if(user) return ctx.ok(user)
  
  throw new HttpError('This data was not found', NOT_FOUND)
})

module.exports = route
