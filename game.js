var io;
var gameSocket;
var Globals;

Player = require('./player');
var players = {};
var sockets = {};

module.exports = {

    initGame: function(io, socket) {
        //io = sio;    
        //gameSocket = socket;
        console.log('socket.id: ' + socket.id);
		sockets[socket.id] = socket;

		//gameSocket.on('updateGlobals', updateGlobals);
		socket.on('updateGlobals', function(msg) {
            console.log('updateGlobals callback');
            console.log('msg: ' + msg);
            console.log('Globals: ' + Globals);
            Globals = msg;
        });

        //gameSocket.on('addPlayer', addPlayer);
        socket.on('addPlayer', function(msg) {
            console.log('addPlayer callback');
            players[socket.id] = msg.player;
            //players[msg.socketId] = msg.player;
        });

        //socket.on('movePlayer', movePlayer);
        socket.on('movePlayer', function(msg) {
            console.log('movePlayer callback');
            let player = msg.player;
            let key = msg.keyPressed;
            switch (key) {
                case Globals.KEY_UP:
                    players[socket.id].y -= Globals.PLAYER_SPEED;
                    player.y -= Globals.PLAYER_SPEED;
                    break;
                case Globals.KEY_RIGHT:
                    players[socket.id].x += Globals.PLAYER_SPEED;
                    player.x += Globals.PLAYER_SPEED;
                    break;
                case Globals.KEY_DOWN:
                    players[socket.id].y += Globals.PLAYER_SPEED;
                    player.y += Globals.PLAYER_SPEED;
                    break;
                case Globals.KEY_LEFT:
                    players[socket.id].x -= Globals.PLAYER_SPEED;
                    player.x -= Globals.PLAYER_SPEED;
                    break;
                default:
                    console.log('invalid move key: ' + key);
                    break;
            }
            console.log('player: ');
            console.log(player);
            socket.emit('updatePlayer', player);
        });

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
    io.sockets.connected[socketId].emit('updatePlayer');
	//sockets[socketId].emit('updatePlayer');
}

//function movePlayer(data) {
//	console.log('movePlayer callback');
//	console.log('data: ');
//	console.log(data);
//    socketId = data.socketId;
//    dir = data.dir;
//    player = players[socketId];
//	switch (dir) {                                                         
//		case Globals.KEY_UP:                                               
//			player.y -= Globals.PLAYER_SPEED;                                
//			break;                                                         
//		case Globals.KEY_RIGHT:                                            
//			player.x += Globals.PLAYER_SPEED;                                
//			break;                                                         
//		case Globals.KEY_DOWN:                                             
//			player.y += Globals.PLAYER_SPEED;                                
//			break;                                                         
//		case Globals.KEY_LEFT:                                             
//			player.x -= Globals.PLAYER_SPEED;                                
//			break;                                                         
//		default:                                                           
//			break;                                                         
//	} 
//	//socket.emit('updatePlayer', player);
//    io.sockets.connected[socketId].emit('updatePlayer', player);
//}


