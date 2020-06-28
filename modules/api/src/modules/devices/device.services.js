const Devices = require('./device.models')
const mqtt = require('../../plugins/mqtt/index')

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

const updateOnlineStatus = async (deviceId, isOnline) => {
  return await Devices.query().update({
    isOnline: isOnline,
    lastUpdate: new Date()
  }).where('id', deviceId)
}

const pingDevice = async (deviceMac) => {
  mqtt.client.publish(`devices/${deviceMac}/recv`, 'ping')
}

module.exports = {
  find,
  updateOnlineStatus,
  findById,
  findByMac,
  create,
  remove,
  update,
  updateByMac,
  pingDevice
}
