'use strict'

const http = require('http')

const uuid = require('uuid')
const logger = require('agathias')
const express = require('express')
const adjNoun = require('adj-noun')
const socketIo = require('socket.io')
const bodyParser = require('body-parser')

const port = process.env.PORT || 5000

const app = express()
const server = http.Server(app);
const io = socketIo(server);

adjNoun.seed(666)

let dummyLocations = {
  shelters: (() => {
    return new Array(3)
      .join('0')
      .split('')
      .map((el, index) => {
        return {
          lat: 34.99 + Math.random() * 0.1,
          lng: 32.99 + Math.random() * 0.1,

          temperatureInside: Math.random() * 25 + 20,
          carbonDioxideInside: Math.random() * 1000 + 350,
          oxygenInside: Math.random() * 20 + 18,
          nitrogenInside: Math.random() * 79 + 78,
          argonInside: Math.random() * 1 + 0,


          temperatureOutside: Math.random() * 40 + 20,
          carbonDioxideOutside: Math.random() * 450 + 350,
          humidityOutside:  Math.random() * 40 + 0,
          oxygenOutside: Math.random() * 20 + 18,
          nitrogenOutside: Math.random() * 79+ 78,
          argonOutside: Math.random() * 1 + 0,
          barometerOutside: Math.random() * 767 + 757,
          windSpeedOutside: Math.random() * 12 + 0,
          rainFallOutside: Math.random() * 25 + 0,

          data: {
            name: adjNoun().join(' '),
            id: uuid()
          }
        }
      })
  })(),
  fire: (() => {
    return new Array(6)
      .join('0')
      .split('')
      .map((el, index) => {
        return {
          lat: 34.99 + Math.random() * 0.01,
          lng: 32.99 + Math.random() * 0.01,

          data: {
            name: `Fire ${index}`,
            id: uuid()
          }
        }
      })
  })()
}

app.use(bodyParser.json())

app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

app.get('/api', (req, res) => res.send('Hello there! ( ͡° ͜ʖ ͡°)'))

app.get('/api/shelters', (req, res) => res.send({
  shelters: dummyLocations.shelters
}))

app.post('/api/report', (req, res) => {
  res.sendStatus(200)

  const type = req.body.type
  delete req.body.type
  req.body.data.id = uuid()
  dummyLocations[type].push(req.body.data)
  sendLocations()
})

server.listen(port, () => logger.debug(`Server listening on ${port}`))

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