const MQTT = require('mqtt')
const handlers = require('./handlers')
const wildcard = require('./wildcard')

const mqtt = MQTT.connect(process.env.MQTT_URI)

const topics = {
  'ping': handlers.ping,
  'device/+/send': handlers.sensorReading,
  'gateway/#': handlers.gateway
}

mqtt.on('connect', () => {
  console.info('MQTT: Connected!')
})

mqtt.on('disconnect', () => {
  mqtt.reconnect()
})

mqtt.on('message', (topic, payload) => {
  console.log('MQTT: Recieved', topic)
  let matched = ''

  for (let t in topics) {
    let match = wildcard(topic, t)
    if(match !== null) {
      matched = t
      break;
    }
  }

  const jsonPayload = JSON.parse(payload.toString());
  topics[matched](jsonPayload);
})

exports.mqttPublish = (topic, data) => {
  mqtt.publish(topic, data, () => {
    console.info(`MQTT: Published message to ${topic}`)
  })
}

exports.InitMQTT = () => {
  for(let t in topics) {
    mqtt.subscribe(t, (err, done) => {
      if(err)
        console.error(`MQTT Error: ${err.message}`)
      else
        console.info(`MQTT: Subscribed to [${done[0].topic}]`)
    })
  }
}
