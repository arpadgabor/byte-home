const Devices = require('./device.models')

const find = async ({ key, value, op = '=' }, relation = '') =>
  await Devices.query().withGraphFetched(relation).where(key, op, value)

const findById = async (id, relation = '') =>
  await Devices.query().withGraphFetched(relation).findById(id)

const findByMac = async (mac, relation = '') =>
  await Devices.query().withGraphFetched(relation).where('mac', mac).first()

const create = async (device) => await Devices.query().insert(device)

const update = async (id, updateObject) =>
  await Devices.query().updateAndFetchById(id, updateObject)

const updateByMac = async (mac, updateObject) =>
  await Devices.query().update(updateObject).where('mac', mac)

const remove = async (id) => await Devices.query().deleteById(id)

module.exports = {
  find,
  findById,
  findByMac,
  create,
  remove,
  update,
  updateByMac,
}
