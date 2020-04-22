const { OK, CREATED } = require('../utils/statusCodes')
const Users = require('../services/users')

  
exports.login = async (ctx) => {
  const user = await Users.logIn(ctx.request.body)

  const token = signToken({ id: user.id })

  ctx.cookies.set('token', token)
  return ctx.ok('Authorized.')
}

exports.register = async (ctx) => {
  const user = await Users.signUp(ctx.request.body)

  ctx.status = CREATED
  return ctx.body = { message: 'User registered.', email: user.email }
}

exports.forgot = async (ctx) => {
  return ctx.noContent()
}

exports.logout = async ctx => {
  ctx.cookies.set('token')
  return ctx.ok('Logged out.')
}

module.exports = route
