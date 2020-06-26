import Vue from 'vue'
import VueSocketIOExt from 'vue-socket.io-extended'
import IO from 'socket.io-client'

const socket = IO('/', { reconnection: true })

Vue.use(VueSocketIOExt, socket)
