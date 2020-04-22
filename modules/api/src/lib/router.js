const Router = require('@koa/router')
const AuthRoutes = require('../modules/auth/routing')

const router = new Router({
  prefix: '/api'
})

router.use(AuthRoutes.routes())

console.log(' API: Print routes')
router.stack.forEach(route => {
  console.log('    :', route.path)
})
console.log(' API: ============')

module.exports = router
