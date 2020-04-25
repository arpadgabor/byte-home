const Joi = require('@hapi/joi')

exports.validate = (schema) => async (ctx, next) => {
  const result = await Joi.object(schema).validateAsync(ctx.request.body, { abortEarly: false })
  console.log(result)
  ctx.request.body = result
  await next()
}
