const Code = require('../../utils/statusCodes')
const AuthService = require('./auth.services')
const UserService = require('../users/user.services')

exports.login = async (ctx) => {
  const { browser, source, platform } = ctx.userAgent

  const {
    user,
    accessToken,
    refreshToken
  } = await AuthService.authenticate(ctx.request.body)


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

  ctx.send(Code.CREATED, user)
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

  if (!refresh) {
    return ctx.send(Code.FORBIDDEN, 'No refresh token provided')
  }
  const whitelist = await AuthService.findToken(refresh)

  try {
    if (!whitelist) {
      // Refresh is not in whitelist
      ctx.cookies.set('refresh', null)
      return ctx.send(Code.UNAUTHORIZED, 'Session invalid')
    }
    // Verify refresh token
    const payload = AuthService.verifyRefresh(refresh)
    const user = await UserService.findById(payload.sub, 'person')

    const accessToken = AuthService.generateAccessToken({
      id: user.id,
      roles: payload.scope,
      verified: user.verified,
    })

    ctx.send(Code.OK, {
      accessToken: accessToken,
    })
  } catch (e) {
    console.log(e)

    if (whitelist) {
      await AuthService.blacklistToken(whitelist.token)
    }
    ctx.cookies.set('refresh', null)
    return ctx.send(Code.UNAUTHORIZED, 'Session expired')
  }
}
