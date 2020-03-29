const { Devices, Sensors } = require('../../models')
const { sendUUID } = require('./publishers')

const onPing = payload => {
  console.log(payload)
}

const onBoot = async payload => {
  const deviceMac = payload.mac
  const deviceQuery = await Devices.query().where('mac', deviceMac).first()

  if(!deviceQuery) {
    const sensors = payload.mac.msg
    await Devices.query().insertGraph({
      mac: deviceMac,
      sensors: sensors
    })
  }

  sendUUID(deviceMac, deviceQuery.id)
}

const onReading = async payload => {
  for(let sensor of payload.msg.data) {
    try {
      await Sensors.query().insert({
        mac: payload.mac,
        name: sensor.name,
        data: sensor.value,
        unit: sensor.unit
      })
    } catch (e) {
      console.log(e)
    }
  }
}

const gateway = payload => {
  console.log(payload)
}

module.exports = {
  'ping': onPing,
  'device/+/send/reading': onReading,
  'device/+/send/boot': onBoot,
  'gateway/#': gateway
}
