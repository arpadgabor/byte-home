const { InitMQTT } = require('./plugins/mqtt')
const app = require('./lib/app')

InitMQTT()

app.listen(process.env.PORT)
console.info(`NODE: Listening at http://localhost:${process.env.PORT}/api`)
