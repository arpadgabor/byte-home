const Person = require('./people.models')
const Users = require('../users/user.models')

const create = async ({ firstName, lastName }, userId) =>
  await Users.relatedQuery('person')
    .for(userId)
    .insert({ firstName: firstName, lastName: lastName })

module.exports = {
  create
}
