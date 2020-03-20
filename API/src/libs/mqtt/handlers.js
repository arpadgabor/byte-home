const { Sensors } = require('../../models')

module.exports = {
  ping(payload) {
    console.log(payload)
  },
  async sensorReading(payload) {
    console.log(payload.msg)

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
  },
  gateway(payload) {
    console.log(payload)
  }
}
