const config = require('../../../config')
const jwt = require('jsonwebtoken')
const { HttpError } = require('../../utils/errors')
const Code = require('../../utils/statusCodes')
const { TokenWhitelist } = require('./models')

const publicGuard = async (ctx, next) => {
  const accessToken = ctx.cookies.get('access', {signed: true})
  const refreshToken = ctx.cookies.get('refresh', {signed: true})
  
  if(accessToken || refreshToken) {
    throw new HttpError('Unauthorized', Code.UNAUTHORIZED)
  }

  await next()
}

const userGuard = async (ctx, next) => {
  const accessToken = ctx.cookies.get('access', {signed: true})
  const refreshToken = ctx.cookies.get('refresh', {signed: true})

  if(!(accessToken && refreshToken)) {
    return ctx.send(Code.FORBIDDEN, 'You are not authorized to do this')
  }

  try {
    jwt.verify(accessToken, config.get('jwtSecret'))
    await next()
  } catch(e) {
    console.log(e)
    try {
      const payload = jwt.verify(refreshToken, config.get('refreshSecret'))

      ctx.cookies.set('access', jwt.sign({ 
        sub: payload.sub, scope: payload.scope
      }, config.get('jwtSecret'), { expiresIn: 60 }), { signed: true })

      await next()
    } catch (e) {
      console.log(e)
      await TokenWhitelist.query().delete().where('token', refreshToken)
      ctx.cookies.set('refresh', null, {signed: true})
      ctx.cookies.set('access', null, {signed: true})
      ctx.send(Code.FORBIDDEN, 'You were logged out')
    }
  }
}

module.exports = {
  publicGuard,
  userGuard
}
