const Households = require('./household.models')
const DeviceServices = require('../devices/device.services')
const UserService = require('../users/user.services')

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

module.exports = {
  find,
  findById,
  create,
  remove,
  update,
  addDevice,
}
