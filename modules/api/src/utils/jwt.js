const jwt = require('jsonwebtoken')
const config = require('../../config')

const accessSecret = config.get('jwtSecret')
const refreshSecret = config.get('refreshSecret')

const accessTokenExpiry = '60s'
const refreshTokenExpiry = '7d'

exports.signAccessToken = payload => {
  return jwt.sign(payload, accessSecret, { expiresIn: accessTokenExpiry })
}

exports.signRefreshToken = payload => {
  return jwt.sign(payload, refreshSecret, { expiresIn: refreshTokenExpiry })
}

exports.verifyToken = token => {
  return jwt.verify(token, secret)
}
