const MQTT = require('mqtt')

const mqtt = MQTT.connect(process.env.MQTT_URI)
const topics = ['ping', 'test', 'sensor/data']

mqtt.on('connect', () => {
  console.info('MQTT: Connected!')
})

mqtt.on('disconnect', () => {
  mqtt.reconnect()
})

exports.mqttPublish = (topic, data) => {
  mqtt.publish(topic, data, () => {
    console.info(`MQTT: Published message to ${topic}`)
  })
}

exports.InitMQTT = () => {
  topics.forEach(t => {
    mqtt.subscribe(t, (err, done) => {
      if(err)
        console.error(`MQTT Error: ${err.message}`)
      else
        console.info(`MQTT: Subscribed to [${done[0].topic}]`)
    })
  })
}
