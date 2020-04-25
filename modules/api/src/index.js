const config = require('../config')
const app = require('./lib/app')
const mqtt = require('./plugins/mqtt')
require('./lib/db')

// mqtt(config.get('mqttUrl'))
app.listen(config.get('port'))

console.info(`NODE: Listening at http://${config.get('ip')}:${config.get('port')}/`)
