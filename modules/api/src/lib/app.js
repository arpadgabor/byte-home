const Koa = require('koa')

const BodyParser = require('koa-bodyparser')
const Helmet = require('koa-helmet')
const Logger = require('koa-logger')
const Respond = require('koa-respond')
const UserAgent = require('koa2-useragent')

const ErrorHandlers = require('./errors')
const Api = require('./router')

const app = new Koa()

app.keys = ['this is a secret', 'i like turtle secrets xoxo']

app.use(ErrorHandlers)
app.use(UserAgent())
app.use(Logger())
app.use(Helmet())
app.use(BodyParser())
app.use(Respond())

app.use(Api.routes())
app.use(Api.allowedMethods())

module.exports = app
