var Globals;

var players = {};
var sockets = {};
var projectiles = {};

module.exports = {

    initGame: function(io, socket) {
        console.log('socket.id: ' + socket.id);
		sockets[socket.id] = socket;

        socket.on('disconnect', function() {
            console.log('deleting player[' + socket.id + ']');
            delete players[socket.id];
        });

		//gameSocket.on('updateGlobals', updateGlobals);
		socket.on('updateGlobals', function(msg) {
            if (!Globals) {
                Globals = msg.Globals;
            }
        });

        //gameSocket.on('addPlayer', addPlayer);
        socket.on('addPlayer', function(msg) {
            let player = msg.player;
            player.id = socket.id;

            // spawn player at random noncolliding position
            while (true) {
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
           
            //socket.emit('updatePlayer', { player: player });
            socket.emit('startGame', { player: player });
        });

        socket.on('updatePlayer', function(msg) {
            players[socket.id] = msg.player;
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

        socket.on('playerDied', function() {
            delete players[socket.id];
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
                        //sockets[playerId].off('movePlayer');
                        sockets[playerId].emit('killPlayer');
                    }
                }
            }
        }

        function gameLoop() {
            updateHits();
            deleteOutOfRangeProjectiles();
            for (id in projectiles) {
                let proj = projectiles[id];
                let dx = Math.cos(proj.dir) * proj.speed;
                let dy = Math.sin(proj.dir) * proj.speed;
                proj.x += dx;
                proj.y += dy;
            }
            socket.emit('updateProjectiles', { projectiles: projectiles });
            for (id in players) {
                let p = players[id];
                //sockets[id].emit('movePlayer', { player: p });
                sockets[id].emit('movePlayer');
            }
        }
        //setInterval(gameLoop, 100);
        setInterval(gameLoop, 10);
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

function getL2Distance(p1, p2) {
    let xdist = Math.abs(p2.x - p1.x);
    let ydist = Math.abs(p2.y - p1.y)
    return Math.sqrt((xdist * xdist) + (ydist * ydist));
}



