var Globals;

var players = {};
var sockets = {};
var projectiles = {};
var powerups = {};

module.exports = {

    initGame: function(io, socket) {
        console.log('socket.id: ' + socket.id);
		sockets[socket.id] = socket;

        socket.on('disconnect', function() {
            console.log('deleting player[' + socket.id + ']');
            delete players[socket.id];
            delete sockets[socket.id];
        });

		//gameSocket.on('updateGlobals', updateGlobals);
		socket.on('updateGlobals', function(msg) {
            if (!Globals) {
                Globals = msg.Globals;
                runGame();
            }
        });

        //gameSocket.on('addPlayer', addPlayer);
        socket.on('addPlayer', function(msg) {
            console.log('addPlayer callback');
            let player = msg.player;
            player.id = socket.id;

            // spawn player at random noncolliding position
            while (true) {
                let x = Math.floor((Math.random() * Globals.DEFAULT_MAP_WIDTH - player.radius) + 1) 
                let y = Math.floor((Math.random() * Globals.DEFAULT_MAP_HEIGHT - player.radius) + 1)
                player.x = x;
                player.y = y;

                // check if any player is colliding if new player spawns at (x,y)
                if (checkCollisions(player))
                    continue;
                else
                    break;
            }
            players[socket.id] = player;
            socket.emit('joinGame', { player: player });
        });

        socket.on('updatePlayer', function(msg) {
            //console.log('updatePlayer callback');
            if (players[socket.id])
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

//////////////////////////////////////////////////////////////////////
// Utilities
//////////////////////////////////////////////////////////////////////

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

function generatePowerup(player) {
    player.powerup = Globals.POWER_CANNON;

    switch(player.powerup) {
    case Globals.POWER_CANNON:
        return 'Cannon';
    default:
        return 'None';
    }
}

//////////////////////////////////////////////////////////////////////


function updateHits() {
    // if a projectile hits player, projectile dies, player loses hitpoints
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
                players[playerId].hp--;
                sockets[playerId].emit('updatePlayer', { player: players[playerId] });
                if (players[playerId].hp <= 0) {
                    delete players[playerId];
                    sockets[playerId].emit('killPlayer');
                }
            }
        }
    }
}

function moveProjectiles() {
    for (id in projectiles) {
        let proj = projectiles[id];

        // delete out-of-bound projectile
        if (proj.x < 0 || proj.x > Globals.DEFAULT_MAP_WIDTH 
                || proj.y < 0 || proj.y > Globals.DEFAULT_MAP_HEIGHT)
        {
            delete projectiles[id];
            console.log('projectile deleted: ' + id);
        } 
        else {
            let dx = Math.cos(proj.dir) * proj.speed;
            let dy = Math.sin(proj.dir) * proj.speed;
            proj.x += dx;
            proj.y += dy;
        }
    }
    for (id in sockets) {
        sockets[id].emit('updateProjectiles', { projectiles: projectiles });
    }
}

function movePlayers() {
    for (id in sockets) {
        sockets[id].emit('movePlayer');
    }
}

function spawnPowerups() {
    console.log('spawnPowerups');
    console.log('powerups.size: ' + Object.keys(powerups).length);
    console.log('Globals.DEFAULT_MAP_MAX_POWERUPS: ' + Globals.DEFAULT_MAP_MAX_POWERUPS);
    while (Object.keys(powerups).length < Globals.DEFAULT_MAP_MAX_POWERUPS) {
        let x = Math.floor((Math.random() * Globals.DEFAULT_MAP_WIDTH - Globals.DEFAULT_POWERUP_WIDTH) + 1) 
        let y = Math.floor((Math.random() * Globals.DEFAULT_MAP_HEIGHT - Globals.DEFAULT_POWERUP_HEIGHT) + 1)
        let powerup = {
            x: x,
            y: y,
        };
        let id = Object.keys(powerups).length;
        console.log('created powerup: ' + id);
        powerups[id] = powerup;
    }
    for (id in sockets) {
        sockets[id].emit('updatePowerups', { powerups: powerups });
    }
    console.log(powerups);
}

function updatePowerupPickups() {
    for (playerId in players) {
        for (powerId in powerups) {
            let player = players[playerId];
            let powerup = powerups[powerId];
            if (getL2Distance(player, powerup) <= player.radius) {
                // player gets powerup
                let powerName = generatePowerup(player);    
                delete powerups[powerId];
                console.log('deleted powerup ' + powerId);
                console.log('player: ' + player.id + ' gets powerup');
                powerups[powerId] = {
                    x: Math.floor((Math.random() * Globals.DEFAULT_MAP_WIDTH - Globals.DEFAULT_POWERUP_WIDTH) + 1),
                    y: Math.floor((Math.random() * Globals.DEFAULT_MAP_HEIGHT - Globals.DEFAULT_POWERUP_HEIGHT) + 1)
                }
                console.log('created powerup ' + powerId);
                sockets[playerId].emit('updatePlayer', { player: player });

                sockets[playerId].emit('announce', { message: 'You picked up powerup: ' + powerName });
            }
        }
        sockets[playerId].emit('updatePowerups', { powerups: powerups });
    }
}


function runGame() {
    spawnPowerups();
    function gameLoop() {
        updateHits();
        deleteOutOfRangeProjectiles();
        moveProjectiles();
        movePlayers();
        updatePowerupPickups();
    }
    setInterval(gameLoop, 10);
}

//runGame();


