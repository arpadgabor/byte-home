const fs = require('fs')
const { basename, join } = require('path')
const Router = require('@koa/router')

const { isAuth } = require('../middleware/auth')
const errors = require('../middleware/errors')

const baseName = basename(__filename)

/**
 * [koa-respond]
 * ok - HTTP 200
 * created - HTTP 201
 * noContent - HTTP 204 - always sends an empty response!
 * badRequest - HTTP 400
 * unauthorized - HTTP 401
 * forbidden - HTTP 403
 * notFound - HTTP 404
 * internalServerError - HTTP 500
 */

module.exports = (app) => {
  app.use(errors)
  app.use(isAuth)

  const router = new Router({ prefix: `/api` })

  router.get('/', ctx => {
    ctx.ok('hello')
  })

  fs.readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0 && file !== baseName)
    .forEach(file => {
      const api = require(join(__dirname, file))
      router.use(api.routes())
    })

  app.use(router.routes()).use(router.allowedMethods())
}
