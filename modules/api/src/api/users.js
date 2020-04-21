const Router = require('@koa/router')

const { Users } = require('../models')
const { ifUser } = require('../middleware/auth')
const { HttpError } = require('../utils/errors')
const { NOT_FOUND } = require('../utils/statusCodes')

const route = new Router({ prefix: '/users' })

route.get('/me', ifUser, async (ctx) => {
  const user = await Users.query().withGraphFetched('[person, households.[devices]]').where('id', ctx.user.id).first()

  delete user.password
  delete user.verified
  delete user.verificationToken
  delete user.resetToken

  if(user) return ctx.ok(user)

  throw new HttpError('This data was not found', NOT_FOUND)
})

module.exports = route
