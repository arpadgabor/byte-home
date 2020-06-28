const Devices = require('../../modules/devices/device.models')
const Sensors = require('../../modules/sensors/sensor.models')
const Readings = require('../../modules/readings/reading.models')
const { updateOnlineStatus } = require('../../modules/devices/device.services')
const io = require('../sockets')

const onPing = (payload, mqtt) => {
  log.info('MQTT', payload)
}

const registerDevice = async (payload, mqtt) => {
  const device = await Devices.query()
    .withGraphFetched('sensors')
    .where('mac', payload.mac)
    .first()

  if (device) {
    await Devices.relatedQuery('sensors').for(device.id).insert(payload.msg.sensors)
    return
  }

  // If the device does not exist
  await Devices.query().insertGraph({
    mac: payload.mac,
    sensors: payload.msg.sensors,
  })
  mqtt.publish(`device/${payload.mac}/recv`, `uuid:${device.id}\0`)
}

const onReading = async (payload, mqtt) => {
  if (payload.uuid === '') {
    await registerDevice(payload, mqtt)
    return
  }
  try {
    const { updateOnlineStatus } = require('../../modules/devices/device.services')
    await updateOnlineStatus(payload.uuid, true)
  } catch (e) {
    log.error('sub', e)
  }

  const deviceSensors = await Sensors.query()
    .where('device', payload.uuid)
    .select('id', 'type')


  for (let sensor of deviceSensors) {
    try {
      io.socket.broadcast(sensor.id, { value: payload.msg.sensors[sensor.type], datetime: new Date() })

      if (config.get('env') === 'development') {
        continue // do not save to database if in development
      }
      await Readings.query().insert({
        value: payload.msg.sensors[sensor.type],
        sensor: sensor.id,
      })
    } catch (e) {
      log.error('MQTT', e)
    }
  }
}

const gateway = (payload, mqtt) => {
  log.info('MQTT', payload)
}

module.exports = {
  'ping': onPing,
  'device/+/send': onReading,
  'gateway/#': gateway,
}
