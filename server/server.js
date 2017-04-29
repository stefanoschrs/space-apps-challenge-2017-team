'use strict'

const http = require('http')

const logger = require('agathias')
const express = require('express')
const socketIo = require('socket.io')
const uuid = require('uuid')

const app = express()
const server = http.Server(app);
const io = socketIo(server);

app.get('/', (req, res) => res.send('Hello there! ( ͡° ͜ʖ ͡°)'))

server.listen(process.env.PORT || 5000);

/**
 * Socket Stuff
 */
const dummyLocationsShelters = [
  { lat: 35, lng: 33, data: { name: 'S1', id: uuid() }},
  { lat: 34.999381, lng: 32.9985789, data: { name: 'S2', id: uuid() }},
]

const dummyLocationsFire = [
  { lat: 34.999481, lng: 32.9986789, data: { name: 'F1', id: uuid() }},
  { lat: 34.999581, lng: 32.9987789, data: { name: 'F2', id: uuid() }},
]

io.on('connection', (socket) => {
  logger.debug('Client connected')

  socket.on('map-ready', () => {
    setTimeout(() => {
      socket.emit('locations:shelters', dummyLocationsShelters)

      setTimeout(() => {
        socket.emit('locations:shelters', dummyLocationsShelters.slice(1))
      }, 3000)
    }, 3000)

    setTimeout(() => {
      socket.emit('locations:fire', dummyLocationsFire)

      setTimeout(() => {
        socket.emit('locations:fire', dummyLocationsFire.slice(1))
      }, 3000)
    }, 4000)
  })
});