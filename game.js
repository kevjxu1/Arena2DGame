var io;
var gameSocket;
var Globals;

Player = require('./player');
var players = {};
var sockets = {};

module.exports = {

    initGame: function(sio, socket) {
        io = sio;    
        gameSocket = socket;
		sockets[socket.id] = socket;
		gameSocket.on('updateGlobals', updateGlobals);
        gameSocket.on('addPlayer', addPlayer);
        gameSocket.on('movePlayer', movePlayer);
        console.log('game inited');
    },
};

function updateGlobals(data) {
	console.log('updateGlobals');
	console.log('data: ');
	console.log(data);
	Globals = data;
}

function addPlayer(msg) {
	console.log('addPlayer');
	console.log('msg: ');
	console.log(msg);
	let socketId = msg.socketId;
	let player = msg.player;
    //player = new Player('', 'red', Globals.CANVAS_WIDTH / 2, Globals.CANVAS_HEIGHT / 2);
    player[socketId] = player;
    //io.sockets.connected[socketId].emit('updatePlayer');
	console.log(sockets);
	sockets[socketId].emit('updatePlayer');
}

function movePlayer(data) {
	console.log('movePlayer');
	console.log('data: ');
	console.log(data);
    sockId = data.sockId;
    dir = data.dir;
    player = players[sockId];
	switch (dir) {                                                         
		case Globals.KEY_UP:                                               
			player.y -= Globals.PLAYER_SPEED;                                
			break;                                                         
		case Globals.KEY_RIGHT:                                            
			player.x += Globals.PLAYER_SPEED;                                
			break;                                                         
		case Globals.KEY_DOWN:                                             
			player.y += Globals.PLAYER_SPEED;                                
			break;                                                         
		case Globals.KEY_LEFT:                                             
			player.x -= Globals.PLAYER_SPEED;                                
			break;                                                         
		default:                                                           
			break;                                                         
	} 
	//socket.emit('updatePlayer', player);
    io.sockets.connected[socket.id].emit('updatePlayer', player);
}


