const Koa = require('koa')

const BodyParser = require('koa-bodyparser')
const Helmet = require('koa-helmet')
const Logger = require('koa-logger')
const Respond = require('koa-respond')

const ErrorHandlers = require('./errors')
const { routes, allowedMethods } = require('./router')

const app = new Koa()

app.use(ErrorHandlers)
app.use(Logger())
app.use(Helmet())
app.use(BodyParser())
app.use(Respond())

app.use(routes())
app.use(allowedMethods())

module.exports = app
