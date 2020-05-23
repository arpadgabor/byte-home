const multer = require('@koa/multer')
const Router = require('@koa/router')

const Guard = require('../auth/auth.guards')
const FileControllers = require('./file.controllers')

const router = new Router({ prefix: '/files' })
const upload = multer({ dest: 'public/uploads/' })

router.post('/', Guard.userGuard, upload.array('file', 10), FileControllers.upload)

module.exports = router
