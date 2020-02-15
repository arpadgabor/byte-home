const { ValidationError, ForeignKeyViolationError } = require('objection')

module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (err instanceof ValidationError) {
      return ctx.badRequest({
        error: 'ValidationError',
        message: err.message
      })
    }

    if (err instanceof ForeignKeyViolationError) {
      return ctx.badRequest({
        error: 'ForeignKeyViolationError',
        message: err.message
      })
    }
    
    ctx.internalServerError({
      error: 'InternalServerError',
      message: err.message || {}
    })
  }
}
