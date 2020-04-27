const Router = require('@koa/router')
const Joi = require('@hapi/joi')
const Guard = require('../auth/guards')
const { validate } = require('../../utils/validate')
const DeviceControllers = require('./device.controllers')

const router = new Router({ prefix: '/devices' })
