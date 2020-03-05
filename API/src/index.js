const Koa = require('koa')
const Knex = require('knex')
const BodyParser = require('koa-bodyparser')
const Helmet = require('koa-helmet')
const Logger = require('koa-logger')
const Static = require('koa-static')
const Respond = require('koa-respond')
const { Model } = require('objection')

const KnexCfg = require('../knexfile')
const InitAPI = require('./api')
const { InitMQTT } = require('./services/mqtt')

const app = new Koa()

const knex = Knex(KnexCfg)
Model.knex(knex)

app.use(Logger())
app.use(Helmet())
app.use(BodyParser())
app.use(Static('static', { hidden: true }))
app.use(Respond())

module.exports = async function main() {
  console.info('NODE: Starting server...')
  await knex.raw('SELECT 1+1 AS RESULT')
  console.info('  DB: Connected!')

  InitAPI(app)
  InitMQTT()

  app.listen(process.env.PORT)
  console.info(`NODE: Listening at http://localhost:${process.env.PORT}/api`)
}
