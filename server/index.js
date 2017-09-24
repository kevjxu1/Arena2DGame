// Import the Express module
var express = require('express');

// Import the 'path' module (packaged with Node.js)
var path = require('path');

// Create a new instance of Express
var app = express();


// serve 'client/index.html'
app.use(express.static(path.join(__dirname, '../client')));

// Create a Node.js based http server on port 3000
var server = require('http').createServer(app).listen(process.env.PORT || 3000);

// Create a Socket.IO server and attach it to the http server
var io = require('socket.io').listen(server);

var game = require('./game');

// Listen for Socket.IO Connections. 
// On client requests, setup message callbacks
io.sockets.on('connection', function (socket) {
    game.socketSetup.connectSocket(io, socket);
});

// run game loop
game.runGame();


