var io;
var gameSocket;
var Globals;

var players = {};
var sockets = {};

module.exports = {

    initGame: function(io, socket) {
        //io = sio;    
        //gameSocket = socket;
        console.log('socket.id: ' + socket.id);
		sockets[socket.id] = socket;

        socket.on('submitForm', function(msg) {
            let player = msg.player;
            console.log('submitForm callback');
            console.log('player name: ' + player.name);
            players[socket.id] = player;
            socket.emit('startGame');
        });

		//gameSocket.on('updateGlobals', updateGlobals);
		socket.on('updateGlobals', function(msg) {
            console.log('updateGlobals callback');
            Globals = msg;
            console.log('Globals: ');
            console.log(Globals);
        });

        //gameSocket.on('addPlayer', addPlayer);
        socket.on('addPlayer', function(msg) {
            console.log('addPlayer callback');
            players[socket.id] = msg.player;
            console.log('player count: ' + Object.keys(players).length);
            console.log(players);
            //players[msg.socketId] = msg.player;
        });

        //socket.on('movePlayer', movePlayer);
        socket.on('movePlayer', function(msg) {
            //console.log('movePlayer callback');
            let key = msg.keyPressed;
            let player = players[socket.id];
            switch (key) {
                case Globals.KEY_UP:
                    player.y -= player.speed;
                    break;
                case Globals.KEY_RIGHT:
                    player.x += player.speed;
                    break;
                case Globals.KEY_DOWN:
                    player.y += player.speed;
                    break;
                case Globals.KEY_LEFT:
                    player.x -= player.speed;
                    break;
                default:
                    break;
            }
            socket.emit('updatePlayer', { player: player});
        });

        // give client visible players
        socket.on('getVisiblePlayers', function(msg) {
            let visiblePlayers = [];
            let player = msg.player;
            for (let playerId in players) {
                let p = players[playerId];
                if (getL2Distance(player, p) <= player.vision) {
                    visiblePlayers.push(p);
                }
            }
            socket.emit('updateVisiblePlayers', { visiblePlayers: visiblePlayers });
        });

        console.log('game initialized');
    },
};

function getL2Distance(p1, p2) {
    let xdist = Math.abs(p2.x - p1.x);
    let ydist = Math.abs(p2.y - p1.y)
    return Math.sqrt((xdist * xdist) + (ydist * ydist));
}

//function updateGlobals(data) {
//	console.log('updateGlobals');
//	console.log('data: ');
//	console.log(data);
//	Globals = data;
//}

