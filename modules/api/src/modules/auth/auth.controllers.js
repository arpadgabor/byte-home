const Code = require('../../utils/statusCodes')
const AuthService = require('./auth.services')
const UserService = require('../users/user.services')

exports.login = async (ctx) => {
  const { accessToken, refreshToken } = await AuthService.authenticate(
    ctx.request.body
  )
  const { browser, source, platform } = ctx.userAgent

  await AuthService.whitelistToken(user.id, refreshToken, {
    browser: browser,
    platform: platform,
    source: source,
  })

  ctx.cookies.set('refresh', refreshToken, { signed: true })

  return ctx.send(Code.OK, { accessToken: accessToken })
}

exports.register = async (ctx) => {
  const user = await AuthService.register(ctx.request.body)
  delete user.password

  ctx.send(Code.CREATED, { user: user })
}

exports.forgot = async (ctx) => {
  return ctx.noContent()
}

exports.logout = async (ctx) => {
  const refresh = ctx.cookies.get('refresh', { signed: true })
  ctx.cookies.set('refresh', null)
  ctx.cookies.set('access', null)

  await AuthService.blacklistToken(refresh)

  return ctx.send(Code.OK, 'Logged out.')
}

exports.refresh = async (ctx) => {
  const refresh = ctx.cookies.get('refresh', { signed: true })
  const whitelist = await AuthService.findToken(refresh)

  try {
    if (!whitelist) {
      // Refresh is not in whitelist
      ctx.cookies.set('refresh', null)
      return ctx.send(Code.FORBIDDEN, 'Session expired')
    }
    // Verify refresh token
    const payload = AuthService.verifyRefresh(refresh)
    const user = await UserService.findById(payload.sub)

    const accessToken = AuthService.generateAccessToken({
      id: user.id,
      roles: payload.scope,
      verified: user.verified,
    })

    ctx.send(Code.OK, {
      accessToken: accessToken,
    })
  } catch (e) {
    if (whitelist) {
      // Refresh token is not valid & is in whitelist
      await AuthService.blacklistToken(whitelist.token)
    }
    ctx.cookies.set('refresh', null)
    return ctx.send(Code.FORBIDDEN, 'Session expired')
  }
}
