const Router = require('@koa/router')
const Joi = require('@hapi/joi')

const { Households, Users } = require('../models')
const { ifUser } = require('../middleware/auth')
const { validate } = require('../middleware/validations')
const { OK, CREATED } = require('../utils/statusCodes')

const route = new Router({ prefix: '/households' })
  
route.post('/',
  ifUser,
  async (ctx) => {
    const house = await Users.relatedQuery('households')
                            .for(ctx.user.id)
                            .insert({ name: 'My Household' })

    ctx.status = CREATED
    return ctx.body = { message: 'Household added', household: house }
    
  }
)

module.exports = route
