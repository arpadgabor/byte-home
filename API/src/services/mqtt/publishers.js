const { mqtt } = require('./index')

const sendUUID = (mac, uuid) => {
  const parsedmac = mac.split(':').join('')
  mqtt.publish(`device/${parsedmac}/recv/uuid`, uuid)
}

const sendCommand = (mac, command) => {
  const parsedmac = mac.split(':').join('')
  mqtt.publish(`device/${parsedmac}/recv/cmd`, command)
}

module.exports = {
  sendUUID,
  sendCommand
}
