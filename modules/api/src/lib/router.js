const Router = require('@koa/router')
const AuthRoutes = require('../modules/auth/auth.routing')
const HouseholdRoutes = require('../modules/households/household.routing')
const UserRoutes = require('../modules/users/user.routing')

const router = new Router({
  prefix: '/api',
})

router.use(AuthRoutes.routes())
router.use(HouseholdRoutes.routes())
router.use(UserRoutes.routes())

console.log(' API: Print routes')
router.stack.forEach((route) => {
  console.log('    :', route.path)
})
console.log(' API: ============')

module.exports = router
