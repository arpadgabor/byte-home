const Joi = require('@hapi/joi')

exports.validate = (schema, type = 'body') => async (ctx, next) => {
  const result = await Joi.object(schema).validateAsync(ctx.request[type], {
    abortEarly: false,
  })

  ctx.request.body = result
  await next()
}
