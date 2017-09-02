var io;
var gameSocket;
var Globals;

var players = {};
var sockets = {};
var projectiles = {};

module.exports = {

    initGame: function(io, socket) {
        //io = sio;    
        gameSocket = socket;
        console.log('socket.id: ' + socket.id);
		sockets[socket.id] = socket;

        socket.on('disconnect', function() {
            console.log('deleting player[' + socket.id + ']');
            delete players[socket.id];
        });

		//gameSocket.on('updateGlobals', updateGlobals);
		socket.on('updateGlobals', function(msg) {
            Globals = msg;
        });

        //gameSocket.on('addPlayer', addPlayer);
        socket.on('addPlayer', function(msg) {
            console.log('addPlayer callback');

            let player = msg.player;
            player.id = socket.id;

            // spawn player at random noncolliding position
            while (true) {
                console.log('randomizing');
                let x = Math.floor((Math.random() * Globals.SCREEN_WIDTH - player.radius) + 1) 
                let y = Math.floor((Math.random() * Globals.SCREEN_HEIGHT - player.radius) + 1)
                player.x = x;
                player.y = y;

                // check if any player is colliding if new player spawns at (x,y)
                if (checkCollisions(player))
                    continue;
                else
                    break;
            }
            players[socket.id] = player;
           
            socket.emit('updatePlayer', { player: player });
            socket.emit('startGame', { player: player });
        });

        socket.on('movePlayer', function(msg) {
            //console.log('movePlayer callback');
            let key = msg.keyPressed;
            let player = players[socket.id];
            let oldX = player.x;
            let oldY = player.y;
            switch (key) {
                case Globals.KEY_UP:
                    player.y -= player.speed;
                    player.dir = Globals.UP;
                    if (checkCollisions(player)) 
                        player.y = oldY;
                    break;
                case Globals.KEY_RIGHT:
                    player.x += player.speed;
                    player.dir = Globals.RIGHT;
                    if (checkCollisions(player))
                        player.x = oldX;
                    break;
                case Globals.KEY_DOWN:
                    player.y += player.speed;
                    player.dir = Globals.DOWN;
                    if (checkCollisions(player))
                        player.y = oldY;
                    break;
                case Globals.KEY_LEFT:
                    player.x -= player.speed;
                    player.dir = Globals.LEFT;
                    if (checkCollisions(player))
                        player.x = oldX;
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

        socket.on('addProjectile', function(msg) {
            let key = msg.keyPressed;
            let proj = msg.proj;
            if (!proj.dir) {
                // if direction not initialized, don't add the projectile
                return;
            }
            projectiles[proj.id] = proj;
            socket.emit('updateProjectiles', { projectiles: projectiles });
        });

        function updateHits() {
            // if a projectile hits player, both die
            for (projId in projectiles) {
                let proj = projectiles[projId];
                for (playerId in players) {
                    if (playerId == proj.playerId)
                        // a player cannot shoot himself
                        continue;

                    let player = players[playerId];
                    let xdiff = proj.x - player.x;
                    let ydiff = proj.y - player.y;
                    let dist = Math.sqrt((xdiff * xdiff) + (ydiff * ydiff));
                    if (dist < proj.radius + player.radius) {
                        delete projectiles[projId];
                        delete players[playerId];
                        sockets[playerId].emit('playerDied');
                    }
                }
            }
        }


        
        function gameLoop() {
            updateHits();
            deleteOutOfRangeProjectiles();
            for (id in projectiles) {
                let proj = projectiles[id];
                switch(proj.dir) {
                case Globals.UP:
                    proj.y -= proj.speed;
                    break;
                case Globals.LEFT:
                    proj.x -= proj.speed;
                    break;
                case Globals.RIGHT:
                    proj.x += proj.speed;
                    break;
                case Globals.DOWN:
                    proj.y += proj.speed;
                    break;
                default:
                    break;
                }
            }
            socket.emit('updateProjectiles', { projectiles: projectiles });
        }
        setInterval(gameLoop, 100);

        console.log('game initialized');
    },
};

function deleteOutOfRangeProjectiles() {
    for (id in projectiles) {
        let proj = projectiles[id];
        let xdiff = proj.x - proj.startX;
        let ydiff = proj.y - proj.startY;
        let dist = Math.sqrt((xdiff * xdiff) + (ydiff * ydiff));
        if (dist > proj.range) {
           delete projectiles[id]; 
        }
    }
}

function checkCollisions(player) {
    for (id in players) {
        if (id == player.id)
            continue;
        let other = players[id];
        let xdiff = player.x - other.x;
        let ydiff = player.y - other.y;
        let dist = Math.sqrt((xdiff * xdiff) + (ydiff * ydiff));
        if (dist < player.radius + other.radius) {
            // collision detected
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



