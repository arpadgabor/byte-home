const Router = require('@koa/router')
const Joi = require('@hapi/joi')
const Guard = require('../auth/auth.guards')
const { validate } = require('../../utils/validate')
const SensorControllers = require('./sensor.controllers')

const router = new Router({ prefix: '/sensors' })

router.get('/timeseries/:sensorId', Guard.userGuard, validate({
  from: Joi.date().required(),
  to: Joi.date().required(),
  step: Joi.string().valid('minute', 'hour', 'day', 'week', 'month', 'year').required(),
  avg: Joi.boolean().optional().default('true'),
  min: Joi.boolean().optional().default('false'),
  max: Joi.boolean().optional().default('false'),
  compareBy: Joi.string().valid('minute', 'hour', 'day', 'month', 'year').optional(),
  compareAt: Joi.number().optional()
}, 'query'), SensorControllers.getTimeseries)

module.exports = router
