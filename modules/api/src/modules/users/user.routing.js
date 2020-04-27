const Router = require('@koa/router')
const Joi = require('@hapi/joi')
const Guard = require('../auth/auth.guards')
const { validate } = require('../../utils/validate')
const UserControllers = require('./user.controllers')

const router = new Router({ prefix: '/users' })

router.get('/', Guard.userGuard, UserControllers.getMe)

module.exports = router
