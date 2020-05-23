const config = require('../config')
const log = require('./utils/logger')
global.config = config
global.log = log

const app = require('./lib/app')
const mqtt = require('./plugins/mqtt')
const socket = require('./plugins/sockets')
require('./lib/db')

socket.start(app)
mqtt(config.get('mqttUrl'))
app.listen(config.get('port'), config.get('host'))

log.warn('\nNODE', `Listening at http://${config.get('host')}:${config.get('port')}/`)
log.info('NODE', `Environment: ${config.get('env')}\n`)
