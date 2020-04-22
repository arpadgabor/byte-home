const Objection = require('objection')
const Joi = require('@hapi/joi')
const { HttpError } = require('../utils/errors')

module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if(err instanceof HttpError) {
      ctx.status = err.status
      return ctx.body = {
        error: 'Error',
        message: err.message
      }
    }

    if(err instanceof Joi.ValidationError) {
      return ctx.badRequest({
        error: 'ValidationError',
        message: err.message
      })
    }

    if (err instanceof Objection.ValidationError) {
      return ctx.badRequest({
        error: 'ValidationError',
        message: err.message
      })
    }

    if (err instanceof Objection.ForeignKeyViolationError) {
      return ctx.badRequest({
        error: 'ForeignKeyViolationError',
        message: err.message
      })
    }
    
    console.error(err)
    return ctx.internalServerError({
      error: 'InternalServerError',
      message: err.message || 'This error does not have a message, apparently.'
    })
  }
}
