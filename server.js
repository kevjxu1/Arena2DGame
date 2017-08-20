'use strict';

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function(socket) {
    console.log('A user connected');
    //socket.on('playerJoined', function(data) {
    //    var msg;
    //    msg = data.name + ' has joined the Arena';
    //    console.log(msg);
    //});
});

//app.use(express.static(__dirname + '/../client'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(3000, function() {
    console.log('Listening on port 3000');
});
