const Router = require('@koa/router')
const route = new Router({ prefix: '/users' })
  
route.get('/', async (ctx) => {
  return ctx.ok('hellooo')
})

module.exports = route
