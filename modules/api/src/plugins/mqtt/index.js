const MQTT = require('mqtt')
const topics = require('./subscriptions')
const wildcard = require('./wildcard')

function broker(connection) {
  const mqtt = MQTT.connect(connection)

  handlers(mqtt)
  subscribe(mqtt)
}

function handlers(mqtt) {
  mqtt.on('connect', () => {
    console.info('MQTT: Connected!')
  })

  mqtt.on('disconnect', () => {
    mqtt.reconnect()
  })

  mqtt.on('message', (topic, payload) => {
    console.log('MQTT: Recieved', topic)
    let matched = ''

    // Find matched topic
    for (let t in topics) {
      let match = wildcard(topic, t)
      if (match !== null) {
        matched = t
        break;
      }
    }

    try {
      const jsonPayload = JSON.parse(payload.toString());
      topics[matched](jsonPayload, mqtt);
    } catch (e) {
      console.log(e)
    }
  })
}

function subscribe(mqtt) {
  for (let t in topics) {
    mqtt.subscribe(t, (err, done) => {
      if (err)
        console.error(`MQTT Error: ${err.message}`)
      else
        console.info(`MQTT: Subscribed to [${done[0].topic}]`)
    })
  }
}

module.exports = broker
