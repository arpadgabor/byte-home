const Households = require('./household.models')
const DeviceServices = require('../devices/device.services')
const UserService = require('../users/user.services')
const Crypto = require('crypto')
const { addMinutes } = require('date-fns')
const { HttpError } = require('../../utils/errors')
const Code = require('../../utils/statusCodes')

const find = async (userId) => {
  const { households } = await UserService.findById(userId, 'households')
  return households
}

const findById = async (id, relation = '') =>
  await Households.query().withGraphFetched(relation).findById(id)

const create = async (household) => await Households.query().insert(household)

const update = async (id, updateObject) =>
  await Households.query().updateAndFetchById(id, updateObject)

const remove = async (id) => await Households.query().deleteById(id)

const addDevice = async (mac, householdId) => {
  return await DeviceServices.updateByMac(mac, { household: householdId })
}

const generateInviteCode = () => {
  const hmac = Crypto.createHmac('sha256', Date.now().toString())
  hmac.update(Date.now().toString());

  return {
    inviteCode: hmac.digest('base64'),
    inviteExpiry: addMinutes(new Date(), 60)
  }
}

const verifyInvite = async (inviteCode, userId) => {
  const household = await Households.query().withGraphFetched('users').where('inviteCode', inviteCode).andWhere('inviteExpiry', '>', new Date()).first()

  if (!household) {
    throw new HttpError('Invite code invalid or does not exist.', Code.BAD_REQUEST)
  }

  if (household.users.find(user => user.id === userId)) {
    throw new HttpError('Cannot join the same household again.', Code.CONFLICT)
  }

  await household.$relatedQuery('users').relate(userId)
  return household
}

module.exports = {
  find,
  findById,
  create,
  remove,
  update,
  addDevice,
  generateInviteCode,
  verifyInvite
}
