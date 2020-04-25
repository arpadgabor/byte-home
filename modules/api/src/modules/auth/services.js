const jwt = require('jsonwebtoken')
const config = require('../../../config')
const Code = require('../../utils/statusCodes')
const UserService = require('../users/services')
const { hash, verify, argon2id } = require('argon2')
const { TokenWhitelist, Roles } = require('./models')
const { HttpError } = require('../../utils/errors')

const register = async ({ email, password }) => {
  const hashed = hash(password, { type: argon2id })

  const user = await UserService.create({ email: email, password: password })
  
}

const authenticate = async ({ email, password }) => {
  let user = await UserService.findByEmail(email, 'roles')

  user.roles = user.roles.map(role => role.name)
  const match = await verify(user.password, password, { type: argon2id })

  if(match) {
    return {
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
        verified: user.verified
      },
      ...await generateTokenPair(user)
    }
  } else {
    throw HttpError('Password or email do not match', Code.BAD_REQUEST)
  }
}

const generateTokenPair = async ({ id, roles }) => {
  const payload = {
    sub: id,
    scope: roles
  }

  const accessToken = jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 60 })
  const refreshToken = jwt.sign(payload, config.get('refreshSecret'), { expiresIn: '7d' })

  return {
    accessToken,
    refreshToken
  }
}

const whitelistToken = async (userid, token, userAgent) => {
  return await TokenWhitelist.query().insert({
    token: token,
    userAgent: userAgent,
    user: userid,
  })
}

module.exports = {
  register,
  authenticate,
  whitelistToken
}
