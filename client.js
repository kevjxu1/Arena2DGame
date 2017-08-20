var io = require('socket.io-client');
var globals = require('./globals');
var express = require('express');
var app = express();
//var canvas = document.getElementById('canvas');
//var context = canvas.getContext('2d');
var Player = require('../classes/player.js');

var nameInput = document.getElementById('nameInput');

var socket = io('http://localhost');

window.onload = function() {
    nameInput.addEventListener('keypress', function(e) {
        key = e.keyCode;
        console.log(e.keyCode);
        if (key == globals.KEY_ENTER) {
            console.log('A name has been entered');
            if (!socket) {
                socket = io('http://localhost');
            }
        }
        setupSocket(socket);

        x = calcX();
        y = calcY();
        socket.emit('playerJoined', new Player(nameInput.value, x, y));
    })
};

function calcX() { 
    return 0;
}

function calcY() {
    return 0;
}

function setupSocket(socket) {

}


//function gameLoop() {
//    context.fillStyle = globals.backgroundColor;
//    context.fillRect(0, 0, globals.SCREEN_WIDTH, globals.SCREEN_HEIGHT);
//}
//setInterval(gameLoop, 10);
