const MQTT = require('mqtt')
const topics = require('./subscriptions')
const wildcard = require('./wildcard')
const DeviceServices = require('../../modules/devices/device.services')

class Mqtt {
  constructor() {
    this.connectionString = null
    this.client = null
  }
  /**
   * @param {string} connectionString
   * @param {MQTT.IClientOptions} options
   * @returns {MQTT.MqttClient}
   */
  connect(connectionString, options = undefined) {
    this.connectionString = connectionString
    this.client = MQTT.connect(connectionString, options)

    this.handlers()
    this.subscribers()
  }

  handlers() {
    this.client.on('connect', () => {
      log.info('MQTT', 'Connected!')
    })

    this.client.on('disconnect', () => {
      log.error('MQTT', 'Disconnected.')
      log.warn('MQTT', 'Reconnecting...')
      mqtt.reconnect()
    })

    this.client.on('message', (topic, payload) => {
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

        topics[matched](jsonPayload, this.client);
      } catch (e) {
        log.error('MQTT', e)
      }
    })
  }

  subscribers() {
    for (let t in topics) {
      this.client.subscribe(t, (err, done) => {
        if (err)
          log.error('MQTT', `${err.message}`)
        else
          log.info('MQTT', `Subscribed to [${done[0].topic}]`)
      })
    }
  }
}

module.exports = new Mqtt()
