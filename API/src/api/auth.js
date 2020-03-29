const Router = require('@koa/router')
const Joi = require('@hapi/joi')

const { ifUser, ifPublic, signToken } = require('../middleware/auth')
const { validate } = require('../middleware/validations')
const { OK, CREATED } = require('../utils/statusCodes')
const Users = require('../services/users')

const route = new Router({ prefix: '/auth' })
  
route.post('/login', ifPublic, async (ctx) => {
  const user = await Users.logIn(ctx.request.body)

  const token = signToken({ id: user.id })

  ctx.cookies.set('token', token)
  return ctx.ok('Authorized.')
})

route.post(
  '/register',
  ifPublic,
  validate({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(128)
  }),
  async (ctx) => {
    const user = await Users.signUp(ctx.request.body)

    ctx.status = CREATED
    return ctx.body = { message: 'User registered.', email: user.email }
  }
)

route.post('/forgot-password', ifPublic, async (ctx) => {
  return ctx.noContent()
})

route.post('/logout', ifUser, async ctx => {
  ctx.cookies.set('token')
  return ctx.ok('Logged out.')
})

module.exports = route
