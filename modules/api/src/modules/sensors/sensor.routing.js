const Router = require('@koa/router')
const Joi = require('@hapi/joi')
const Guard = require('../auth/auth.guards')
const { validate } = require('../../utils/validate')
const SensorControllers = require('./sensor.controllers')

const router = new Router({ prefix: '/sensors' })

router.get('/:sensorId', Guard.userGuard, SensorControllers.getSensor)
router.put('/:sensorId', Guard.userGuard, validate({
  name: Joi.string().required()
}), SensorControllers.updateSensor)

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

router.get('/timeseries/v2/:sensorId', Guard.userGuard, validate({
  start: Joi.date().required(),
  finish: Joi.date().required(),
  step: Joi.string().optional(),
  avg: Joi.boolean().optional().default('true'),
  min: Joi.boolean().optional().default('false'),
  max: Joi.boolean().optional().default('false')
}, 'query'), SensorControllers.getTimeseriesV2)

router.get('/state/:sensorId', Guard.userGuard, SensorControllers.getState)

module.exports = router
