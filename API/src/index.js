const Koa = require('koa')
const Knex = require('knex')
const BodyParser = require('koa-bodyparser')
const Helmet = require('koa-helmet')
const Logger = require('koa-logger')
const Static = require('koa-static')
const Respond = require('koa-respond')
const KnexCfg = require('../knexfile')
const { Model } = require('objection')
const controllers = require('./controllers')

const app = new Koa()

const knex = Knex(KnexCfg)
Model.knex(knex)

app.use(Logger())
app.use(Helmet())
app.use(BodyParser())
app.use(Static('static', { hidden: true }))
app.use(Respond())
controllers(app)

module.exports = async function main() {
  console.info('Starting server...')

  await knex.raw('SELECT 1+1 AS RESULT')
  await knex.migrate.latest()

  app.listen(process.env.PORT)
  console.info(`Listening at http://localhost:${process.env.PORT}/api`)
}
