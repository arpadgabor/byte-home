const fs = require('fs')
const { basename, join } = require('path')
const Router = require('@koa/router')

const { isAuth } = require('../middleware/auth')
const errors = require('../middleware/errors')

const baseName = basename(__filename)

module.exports = (app) => {
  app.use(errors)
  app.use(isAuth)

  const router = new Router({ prefix: '/api' })

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
  
  console.log(' API: Loaded routes')
  router.stack.forEach(route => {
    console.log('    :', route.path)
  })
}
