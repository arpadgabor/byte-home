const Router = require('@koa/router')
const Joi = require('@hapi/joi')

const { Devices } = require('../models')
const { ifUser } = require('../middleware/auth')
const { validate } = require('../middleware/validations')
const { OK, CREATED } = require('../utils/statusCodes')

const route = new Router({ prefix: '/devices' })
  
route.post('/',
  ifUser,
  validate({ 
    mac: Joi.string().length(17).required(),
    household: Joi.string().required()
  }),
  async (ctx) => {
    const device = await Devices.query().findOne().where('mac', ctx.request.mac)
    await Devices.relatedQuery('household').for(household).relate(device)
  }
)

module.exports = route
