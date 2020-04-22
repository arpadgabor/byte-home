const Router = require('@koa/router')
const Joi = require('@hapi/joi')

// Change into Guards
const { ifUser, ifPublic, signToken } = require('../middleware/auth')
const { validate } = require('../../utils/validate')
const { login, register, forgot, logout } = require('./controllers')

const router = new Router({ prefix: '/auth' })

router.post('/login', publicGuard, login)

router.post('/register', publicGuard, validate({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(128)
}), register)

router.post('/forgot-password', userGuard, forgot)

router.post('/logout', userGuard, logout)

module.exports = router
