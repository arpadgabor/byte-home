const IO = require('koa-socket-2')

class Socket {
  constructor() {
    this.socket = new IO()
  }

  start(server) {
    this.socket.attach(server)
    this.setCallbacks()
  }

  setCallbacks() {
    this.socket.on('connection', sock => {
      log.info('SOCK', 'New connection')
    })

    this.socket.on('disconnect', sock => {
      log.info('SOCK', 'Client disconnected')
    })
  }

  addEvent(event, callback) {
    this.socket.on(event, callback)
  }
}

module.exports = new Socket()
