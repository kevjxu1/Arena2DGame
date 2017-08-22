var io;
var gameSocket;

Player = require('./player');
var players = {};

module.exports = {

    initGame:  function(sio. socket) {
        io = sio;    
        gameSocket = socket;
        gameSocket.on('addPlayer', addPlayer);
        console.log('game inited');
    },
};

function addPlayer(socket) {
    players[socket.id] = new Player('', 'red', Globals.CANVAS_WIDTH / 2, Globals.CANVAS_HEIGHT / 2);
}


