const { OK, CREATED } = require('../../utils/statusCodes')
const AuthService = require('./services')

exports.login = async (ctx) => {
  const { user, accessToken, refreshToken } = await AuthService.authenticate(ctx.request.body)
  const { browser, source, platform } = ctx.userAgent
  
  await AuthService.whitelistToken(user.id, refreshToken, { browser: browser, platform: platform, source: source })
  
  ctx.cookies.set('refresh', refreshToken, { signed: true })
  ctx.cookies.set('access', accessToken, { signed: true })
  
  return ctx.send(OK, { user: user })
}

exports.register = async (ctx) => {
  const user = await AuthService.register(ctx.request.body)
  
  ctx.send(CREATED, { user: user })
}

exports.forgot = async (ctx) => {
  return ctx.noContent()
}

exports.logout = async ctx => {
  ctx.cookies.set('refresh')
  ctx.cookies.set('access')
  // TODO: Delete refresh from whitelist
  return ctx.ok('Logged out.')
}
