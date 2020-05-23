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
    log.info('MQTT', 'Connected!')
  })

  mqtt.on('disconnect', () => {
    log.error('MQTT', 'Disconnected.')
    log.warn('MQTT', 'Reconnecting...')
    mqtt.reconnect()
  })

  mqtt.on('message', (topic, payload) => {
    log.info('MQTT', `Message on topic [${topic}]`)
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
      log.error('MQTT', e)
    }
  })
}

function subscribe(mqtt) {
  for (let t in topics) {
    mqtt.subscribe(t, (err, done) => {
      if (err)
        log.error('MQTT', `${err.message}`)
      else
        log.info('MQTT', `Subscribed to [${done[0].topic}]`)
    })
  }
}

module.exports = broker
