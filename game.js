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

            // spawn player at random noncolliding position
            //let isEnd = false;
            while (true) {
                let x = Math.floor((Math.random() * Globals.SCREEN_WIDTH - player.size) + 1) 
                let y = Math.floor((Math.random() * Globals.SCREEN_HEIGHT - player.size) + 1)
                player.x = x;
                player.y = y;
                console.log('randomized pos: (' + x + ',' + y);

                // check if any player is colliding if new player spawns at (x,y)
                if (checkCollisions(player))
                    continue;
                else
                    break;
                //isEnd = true;
                //for (id in players) {
                //    let p = players[id];
                //    if (checkCollisionSquares(player, p)) {
                //        // start over
                //        isEnd = false;
                //        break;
                //    }
                //}
            }
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
            //console.log(player);
            socket.emit('updatePlayer', { player: player });
        });

        // give client visible players
        socket.on('getVisibleOthers', function(msg) {
            let visibleOthers = [];  // excluding main player
            let player = msg.player;
            for (let playerId in players) {
                if (playerId == player.id)
                    continue;
                let p = players[playerId];
                if (getL2Distance(player, p) <= player.vision) {
                    visibleOthers.push(p);
                }
            }
            socket.emit('updateVisibleOthers', { visibleOthers: visibleOthers });
        });

        console.log('game initialized');
    },
};

function checkCollisionSquares(sq1, sq2) {
    return (sq1.x <= sq2.x + sq2.size
            && sq1.x + sq1.size >= sq2.x
            && sq1.y <= sq2.y + sq2.size
            && sq1.y + sq1.size >= sq2.y);
}

function checkCollisions(sq) {
    for (id in players) {
        let p = players[id];
        if (checkCollisionSquares(sq, p)) {
            return true;
        }
    }
    return false;
}

//function checkCollision(x, y, width, height) {
//    let unwalkables = players;
//    let x, y;
//    
//    for (let i = 0; i < walkables.length; i++) {
//        if x
//    }
//
//    //while (true) {
//    //    x = Math.floor((Math.random() * Globals.CANVAS_WIDTH - width) + 1) 
//    //    y = Math.floor((Math.random() * Globals.CANVAS_HEIGHT - height) + 1)
//    //    
//    //}
//
//}

function getL2Distance(p1, p2) {
    let xdist = Math.abs(p2.x - p1.x);
    let ydist = Math.abs(p2.y - p1.y)
    return Math.sqrt((xdist * xdist) + (ydist * ydist));
}

