const Router = require('@koa/router')
const Joi = require('@hapi/joi')
const Guard = require('../auth/auth.guards')
const { validate } = require('../../utils/validate')
const SensorControllers = require('./sensor.controllers')

const router = new Router({ prefix: '/sensors' })

router.get('/:id', Guard.userGuard, SensorControllers.getTimeseries)

module.exports = router
