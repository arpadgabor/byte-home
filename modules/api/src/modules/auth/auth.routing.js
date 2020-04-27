const Router = require('@koa/router')
const Joi = require('@hapi/joi')

// Change into Guards
const { publicGuard, userGuard } = require('./auth.guards')
const { validate } = require('../../utils/validate')
const {
  login,
  register,
  forgot,
  logout,
  refresh,
} = require('./auth.controllers')

const router = new Router({ prefix: '/auth' })

router.post(
  '/login',
  publicGuard,
  validate({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(128),
  }),
  login
)

router.post(
  '/register',
  publicGuard,
  validate({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(128),
  }),
  register
)

router.post('/forgot-password', userGuard, forgot)

router.post('/logout', userGuard, logout)

router.post('/ping', userGuard, (ctx) => {
  return ctx.send(200, ctx.request.headers)
})

router.get('/refresh', publicGuard, refresh)

module.exports = router
