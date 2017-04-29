'use strict'

const http = require('http')

const logger = require('agathias')
const express = require('express')
const socketIo = require('socket.io')
const uuid = require('uuid')

const app = express()
const server = http.Server(app);
const io = socketIo(server);

const dummyLocationsShelters = [
  { lat: 35.000139, lng: 32.9980223, data: { name: 'S1', id: uuid() }},
  { lat: 34.999221, lng: 32.9942183, data: { name: 'S2', id: uuid() }},
]

const dummyLocationsFire = [
  { lat: 34.997239, lng: 32.9956561, data: { name: 'F1', id: uuid() }},
  { lat: 34.997206, lng: 32.9984601, data: { name: 'F2', id: uuid() }},
]

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

app.get('/', (req, res) => res.send('Hello there! ( ͡° ͜ʖ ͡°)'))

app.get('/api/shelters', (req, res) => res.send({
  shelters: dummyLocationsShelters
}))

server.listen(process.env.PORT || 5000);

/**
 * Socket Stuff
 */
io.on('connection', (socket) => {
  logger.debug('Client connected')

  socket.on('map-ready', () => {
    socket.emit('locations:shelters', dummyLocationsShelters)
    setTimeout(() => {
      socket.emit('locations:shelters', dummyLocationsShelters.slice(1))
    }, 3000)

    socket.emit('locations:fire', dummyLocationsFire)
    setTimeout(() => {
      socket.emit('locations:fire', dummyLocationsFire.slice(1))
    }, 4000)
  })
})