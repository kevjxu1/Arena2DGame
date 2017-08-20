var io;
var gameSocket;

exports.initGame = function(sio, socket) {
    io = sio;    
    gameSocket = socket;
    console.log('game inited');
};
