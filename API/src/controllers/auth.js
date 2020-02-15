const Router = require('@koa/router')
const Argon = require('argon2')
const { Users } = require('../models')

const { ifUser, ifPublic, signToken } = require('../middleware/auth')

const route = new Router({ prefix: '/auth' })
  
route.post('/login', ifPublic, async (ctx) => {
  const query = Users.query()
  const user = await query.select().where({ email: ctx.request.body.email }).first()
  
  if(!user)
    return ctx.unauthorized(`Email or password don't match.'`)
  if(!await Argon.verify(user.password, ctx.request.body.password))
    return ctx.unauthorized(`Email or password don't match.'`)

  const token = signToken({ id: user.id })
  ctx.cookies.set('token', token)
  return ctx.ok('Authorized.')
})

route.post('/register', ifPublic, async (ctx) => {
  const query = Users.query()

  if(await query.select().where({ email: ctx.request.body.email }).first())
    return ctx.unauthorized('That email is already in use.')
  
  const hash = await Argon.hash(ctx.request.body.password, { type: Argon.argon2id })
  await query.insert({
    email: ctx.request.body.email,
    password: hash
  })

  ctx.created('User has been created.')
})

route.post('/forgot-password', ifPublic, async (ctx) => {
  return ctx.noContent()
})

module.exports = route
