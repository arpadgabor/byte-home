const Router = require('@koa/router')
const Joi = require('@hapi/joi')
const Guard = require('../auth/auth.guards')
const { validate } = require('../../utils/validate')
const HouseholdControllers = require('./household.controllers')

const router = new Router({ prefix: '/households' })

router.get('/', Guard.userGuard, HouseholdControllers.getAll)
router.get('/:id', Guard.userGuard, HouseholdControllers.getById)

router.put(
  '/:id/device',
  Guard.userGuard,
  validate({
    mac: Joi.string().required(),
  }),
  HouseholdControllers.addDevice
)

router.post(
  '/',
  Guard.userGuard,
  validate({
    name: Joi.string().required(),
    address: Joi.object({
      street: Joi.string(),
      latitute: Joi.string(),
      longitude: Joi.string(),
    })
      .optional()
      .default(null),
  }),
  HouseholdControllers.create
)

module.exports = router
