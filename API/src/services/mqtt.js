const MQTT = require('mqtt')

const mqtt = MQTT.connect(process.env.MQTT_URI)

const topics = ['ping', 'confirm', 'sensor/data']

mqtt.on('connect', () => {
  console.info('MQTT: Connected!')
  topics.forEach(topic => {
    mqtt.subscribe(topic, subError)
  })
})

function subError(err, granted) {
  console.log(err ? err : `MQTT: Subscribed to <${granted[0].topic}>`)
}
