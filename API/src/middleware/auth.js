const jwt = require('jsonwebtoken')
const { Users } = require('../models')

const { HttpError } = require('../utils/errors')
const { FORBIDDEN } = require('../utils/statusCodes')

exports.signToken = payload => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
}

exports.isAuth = async (ctx, next) => {
  try {
    const token = jwt.verify(ctx.cookies.get('token'), process.env.JWT_SECRET)
    if('id' in token) {
      ctx.user = { id: token.id }
    } else {
      throw new HttpError('Invalid token!', FORBIDDEN)
    }
  } catch (err) {
    ctx.user = null
  }
  await next()
}

exports.ifPublic = async (ctx, next) => {
  return ctx.user ? ctx.unauthorized(`Users can't do that.`) : await next()
}

exports.ifUser = async (ctx, next) => {
  if (!ctx.user)
    return ctx.unauthorized('You must be logged in.')

  console.info(`[Authorizing user: ${ctx.user.id}]`)
  await next()
}
