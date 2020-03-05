const Argon = require('argon2')
const { Users } = require('../models')
const { HttpError } = require('../utils/errors')
const { INTERNAL_SERVER_ERROR, CONFLICT, FORBIDDEN } = require('../utils/statusCodes')

// TODO: Email verification
exports.signUp = async user => {
  const query = Users.query()

  if(await query.select().where({ email: user.email }).first())
    throw new HttpError('Email is already in use.', CONFLICT)
  
  try {
    const hash = await Argon.hash(user.password, { type: Argon.argon2id })
    const created = await query.insert({
      email: user.email,
      password: hash
    })

    return created
  } catch (e) {
    throw new HttpError(e.message, INTERNAL_SERVER_ERROR)
  }
}

exports.logIn = async user => {
  const query = Users.query()
  const userSearch = await query.select('id', 'email', 'password', 'verified').where({ email: user.email }).first()
  
  if(!(user && await Argon.verify(userSearch.password, user.password)))
    throw new HttpError('Email or password is incorrect.', FORBIDDEN)
  
  return userSearch
}

exports.delete = user => {}
