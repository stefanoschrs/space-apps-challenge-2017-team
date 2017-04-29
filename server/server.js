'use strict'

const http = require('http')

const logger = require('agathias')
const express = require('express')
const socketIo = require('socket.io')
const bodyParser = require('body-parser')
const uuid = require('uuid')

const app = express()
const server = http.Server(app);
const io = socketIo(server);

let dummyLocations = {
  shelters: [
    { lat: 35.000139, lng: 32.9980223, data: { name: 'Shelter 1', id: uuid() }},
    { lat: 34.999221, lng: 32.9942183, data: { name: 'Shelter 2', id: uuid() }},
    { lat: 34.998221, lng: 32.9902183, data: { name: 'Shelter 3', id: uuid() }}
  ],
  fire: [
    { lat: 34.997239, lng: 32.9956561, data: { name: 'Fire 1', id: uuid() }},
    { lat: 34.997206, lng: 32.9984601, data: { name: 'Fire 2', id: uuid() }},
    { lat: 34.997306, lng: 32.9934601, data: { name: 'Fire 3', id: uuid() }},
    { lat: 34.997406, lng: 32.9894601, data: { name: 'Fire 4', id: uuid() }},
    { lat: 34.997506, lng: 32.9844601, data: { name: 'Fire 5', id: uuid() }}
  ]
}

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

app.get('/', (req, res) => res.send('Hello there! ( ͡° ͜ʖ ͡°)'))

app.get('/api/shelters', (req, res) => res.send({
  shelters: dummyLocations.shelters
}))

app.post('/api/report', (req, res) => {
  res.sendStatus(200)

  let data = req.body.data
  data.data.id = uuid()
  dummyLocations[req.body.type].push(req.body.data)
  sendLocations()
})

server.listen(process.env.PORT || 5000);

/**
 * Socket Stuff
 */
io.on('connection', (socket) => {
  logger.debug('Client connected')

  socket.on('map-ready', () => {
    sendLocations()
  })
})

function sendLocations () {
  io.sockets.emit('locations:shelters', dummyLocations.shelters)
  io.sockets.emit('locations:fire', dummyLocations.fire)
}