const Objection = require('objection')
const Joi = require('@hapi/joi')
const { HttpError } = require('../utils/errors')
const Code = require('../utils/statusCodes')

module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (err instanceof HttpError) {
      return ctx.send(err.status, err.message)
    }

    if (err instanceof Joi.ValidationError) {
      return ctx.send(Code.BAD_REQUEST, err.message)
    }

    if (err instanceof Objection.ValidationError) {
      return ctx.send(Code.BAD_REQUEST, err.message)
    }

    if (err instanceof Objection.UniqueViolationError) {
      return ctx.send(Code.CONFLICT, err.message)
    }

    if (err instanceof Objection.ForeignKeyViolationError) {
      return ctx.send(Code.BAD_REQUEST, err.message)
    }

    if (err instanceof Objection.NotFoundError) {
      return ctx.send(Code.NOT_FOUND, err.message)
    }

    console.error(err)
    return ctx.send(
      Code.INTERNAL_SERVER_ERROR,
      err.message || 'Internal error.'
    )
  }
}
