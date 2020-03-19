const Joi = require('@hapi/joi')

exports.validate = (schema) => async (ctx, next) => {
  const toValidate = Joi.object(schema)
  await toValidate.validateAsync(ctx.request.body, { abortEarly: false })
  await next()
}
