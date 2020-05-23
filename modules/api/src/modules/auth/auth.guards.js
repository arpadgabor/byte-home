const config = require('../../../config')
const jwt = require('jsonwebtoken')
const { HttpError } = require('../../utils/errors')
const Code = require('../../utils/statusCodes')
const AuthService = require('./auth.services')

const publicGuard = async (ctx, next) => {
  if (ctx.request.header.authorization) {
    throw new HttpError('Unauthorized', Code.UNAUTHORIZED)
  }

  await next()
}

const userGuard = async (ctx, next) => {
  if (!ctx.request.header.authorization) {
    throw new HttpError('Not authenticated', Code.UNAUTHORIZED)
  }
  const accessToken = ctx.request.header.authorization.split(' ')[1]
  try {
    const payload = AuthService.verifyAccess(accessToken)
    ctx.state.userId = payload.sub
  } catch (e) {
    log.error('JWT', e)
    throw new HttpError('Access expired', Code.UNAUTHORIZED)
  }
  await next()
}

module.exports = {
  publicGuard,
  userGuard,
}
