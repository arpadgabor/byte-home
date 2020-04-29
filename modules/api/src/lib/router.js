const Router = require('@koa/router')

const AuthRoutes = require('../modules/auth/auth.routing')
const HouseholdRoutes = require('../modules/households/household.routing')
const UserRoutes = require('../modules/users/user.routing')
const SensorRoutes = require('../modules/sensors/sensor.routing')

const router = new Router({
  prefix: '/api',
})

router.use(AuthRoutes.routes())
router.use(HouseholdRoutes.routes())
router.use(UserRoutes.routes())
router.use(SensorRoutes.routes())

console.log(' API: Print routes')
router.stack.forEach((route) => {
  if (route.methods.includes('HEAD')) {
    route.methods.shift()
  }

  const printMethod = (method) => {
    switch (method) {
      case 'POST':
        return '  POST'
      case 'PUT':
        return '   PUT'
      case 'PATCH':
        return ' PATCH'
      case 'GET':
        return '   GET'
      case 'DELETE':
        return 'DELETE'
    }
  }

  console.log('    :', printMethod(route.methods[0]), route.path)
})

console.log('=========================================')

module.exports = router
