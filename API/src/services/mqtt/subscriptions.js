const { Devices, Sensors, Readings } = require('../../models')

const onPing = (payload, mqtt) => {
  console.log(payload)
}

// TODO Move method soon TM
const registerDevice = async (payload, mqtt) => {
  const deviceMac = payload.mac
  const deviceQuery = await Devices.query().withGraphFetched('sensors').where('mac', deviceMac).first()
  
  if(!deviceQuery) {
    const sensors = payload.msg.sensors
    await Devices.query().insertGraph({
      mac: deviceMac,
      sensors: sensors
    })
  } else if(deviceQuery.sensors.length === 0) {
    const sensors = payload.msg.sensors
    await Devices.relatedQuery('sensors').for(deviceQuery.id).insert(sensors)
  }

  mqtt.publish(`device/${deviceMac}/recv`, `uuid:${deviceQuery.id}\0`)
}

const onReading = async (payload, mqtt) => {
  console.log(payload)
  if(payload.uuid === '') {
    registerDevice(payload, mqtt)
    return
  }

  const deviceSensors = await Sensors.query().where('device', payload.uuid).select('id', 'type')

  for(let sensor of deviceSensors) {
    try {
      await Readings.query().insert({
        value: payload.msg.sensors[sensor.type],
        sensor: sensor.id
      })
    } catch (e) {
      console.log(e)
    }
  }
}

const gateway = (payload, mqtt) => {
  console.log(payload)
}

module.exports = {
  'ping': onPing,
  'device/+/send': onReading,
  'gateway/#': gateway
}
