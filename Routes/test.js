'use strict'

// Get dependencies
const express = require('express')
const socket = require('socket.io')
const http = require('http')
const passport = require('./app/config/passport')
const app = express()
// Middleware to capture any HTTP responses

app.get('/api/v1/auth/health', function (req, res) {
  return res.status(200).send('Auth micro-service working 100%... \n 13 November, 2019 - 10:31 PM')
})
global.winston = require('./app/config/winston')
// Initialize Express
require('./app/config/express')(app, passport)

// Initializing socket io
require('./app/config/socket.config')(app)

// Initializing mongoose
require('./app/config/mongoose.config')

// Initializing RabbitMQ Receiver on listening.
require('./app/config/rabbitMQ.config')

// Initializing Security Dependencies.
require('./app/config/secure')(app)

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000'

app.set('port', port)

/**
 * Create HTTP server.
 */

const server = http.createServer(app)
const io = socket.listen(server)

require('./app/config/socket.config')(io)

/**
 * Listen on provided port, on all network interfaces.
 */
console.log('Going to listen on port:', port)
server.listen(port, () => console.log(`API running on localhost:${port}`)).on('error', (error) => {
  console.log(error)
})
console.log('After listen on port:', port)

module.exports = app
