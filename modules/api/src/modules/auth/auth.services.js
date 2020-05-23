const jwt = require('jsonwebtoken')
const config = require('../../../config')
const Code = require('../../utils/statusCodes')
const UserService = require('../users/user.services')
const PeopleService = require('../people/people.services')
const { hash, verify, argon2id } = require('argon2')
const { TokenWhitelist, Roles } = require('./auth.models')
const { HttpError } = require('../../utils/errors')

const register = async ({ email, password, firstName, lastName }) => {
  const hashed = await hash(password, { type: argon2id })

  const userRole = await UserService.findRole('user')

  let user = await UserService.create({ email: email, password: hashed })
  await PeopleService.create({ firstName, lastName }, user.id)

  await user.$relatedQuery('roles').relate(userRole)

  return user
}

const authenticate = async ({ email, password }) => {
  let user = await UserService.findByEmail(email, 'roles')

  if (!user) {
    throw new HttpError('Password or email do not match', Code.BAD_REQUEST)
  }

  user.roles = user.roles.map((role) => role.name)
  const match = await verify(user.password, password, { type: argon2id })

  if (match) {
    return {
      user: user,
      accessToken: generateAccessToken({
        id: user.id,
        roles: user.roles,
        verified: user.verified,
      }),
      refreshToken: generateRefreshToken({ id: user.id, roles: user.roles }),
    }
  } else {
    throw new HttpError('Password or email do not match', Code.BAD_REQUEST)
  }
}

const generateAccessToken = ({ id, roles, verified }) => {
  const payload = {
    sub: id,
    scope: roles,
    verified: verified,
  }

  const options = {
    expiresIn: 60 * 15, // 15 minutes
  }

  return jwt.sign(payload, config.get('jwtSecret'), options)
}

const generateRefreshToken = ({ id, roles }) => {
  const payload = {
    sub: id,
    scope: roles,
  }

  const options = {
    expiresIn: '7d', // 7 days
  }

  return jwt.sign(payload, config.get('refreshSecret'), options)
}

const findToken = async (token) => {
  return await TokenWhitelist.query().where('token', token).first()
}

const whitelistToken = async (userid, token, userAgent) => {
  return await TokenWhitelist.query().insert({
    token: token,
    userAgent: userAgent,
    user: userid,
  })
}

const blacklistToken = async (token) => {
  return await TokenWhitelist.query().delete().where('token', token)
}

const verifyAccess = (token) => {
  return jwt.verify(token, config.get('jwtSecret'))
}

const verifyRefresh = (token) => {
  return jwt.verify(token, config.get('refreshSecret'))
}

module.exports = {
  register,
  authenticate,
  whitelistToken,
  blacklistToken,
  generateAccessToken,
  generateRefreshToken,
  findToken,
  verifyAccess,
  verifyRefresh,
}
