const Router = require('@koa/router')
const Joi = require('@hapi/joi')

const { People, Users } = require('../models')
const { validate } = require('../middleware/validations')
const { ifUser } = require('../middleware/auth')
const { HttpError } = require('../utils/errors')
const { NOT_FOUND } = require('../utils/statusCodes')

const route = new Router({ prefix: '/people' })

route.post('/', ifUser,
  validate({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    birthDate: Joi.date()
  }),
  async (ctx) => {
    const person = await Users.relatedQuery('person').for(ctx.user.id).insert(ctx.request.body)
    
    if(person) return ctx.ok(person)
    
    throw new HttpError('This data was not found', NOT_FOUND)
  }
)

module.exports = route
