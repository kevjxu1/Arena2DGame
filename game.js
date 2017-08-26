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

        socket.on('disconnect', function() {
            console.log('deleting player[' + socket.id + ']');
            delete players[socket.id];
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
            let player = msg.player;
            player.id = socket.id;
            players[socket.id] = player;
            socket.emit('updatePlayer', { player: player });
            socket.emit('startGame', { player: player });
        });

        socket.on('movePlayer', function(msg) {
            //console.log('movePlayer callback');
            let key = msg.keyPressed;
            let player = players[socket.id];
            switch (key) {
                case Globals.KEY_UP:
                    player.y -= player.speed;
                    player.dir = Globals.UP;
                    break;
                case Globals.KEY_RIGHT:
                    player.x += player.speed;
                    player.dir = Globals.RIGHT;
                    break;
                case Globals.KEY_DOWN:
                    player.y += player.speed;
                    player.dir = Globals.DOWN;
                    break;
                case Globals.KEY_LEFT:
                    player.x -= player.speed;
                    player.dir = Globals.LEFT;
                    break;
                default:
                    break;
            }
            socket.emit('updatePlayer', { player: player });
        });

        // give client visible players
        socket.on('getVisiblePlayers', function(msg) {
            let visiblePlayers = [];  // excluding main player
            let player = msg.player;
            for (let playerId in players) {
                if (playerId == player.id)
                    continue;
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

