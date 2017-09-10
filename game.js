"use strict";
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

        socket.on('updatePlayerAngle', function(msg) {
            let angle = msg.angle;
            players[socket.id].angle = angle;
        });

        socket.on('updatePlayerDir', function(msg) {
            let moveDir = msg.moveDir;
            players[socket.id].moveDir = moveDir;
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
    for (let id in projectiles) {
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
    for (let id in players) {
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
    sockets[player.id].emit('updatePlayerPowerup', { powerup: player.powerup });
    //switch(player.powerup) {
    //case Globals.POWER_CANNON:
    //    return 'Cannon';
    //default:
    //    return 'None';
    //}
}

//////////////////////////////////////////////////////////////////////


function updateHits() {
    // if a projectile hits player, projectile dies, player loses hitpoints
    for (let projId in projectiles) {
        let proj = projectiles[projId];
        for (let playerId in players) {
            if (playerId == proj.playerId)
                // a player cannot shoot himself
                continue;

            let player = players[playerId];
            let xdiff = proj.x - player.x;
            let ydiff = proj.y - player.y;
            let dist = Math.sqrt((xdiff * xdiff) + (ydiff * ydiff));
            if (dist < proj.radius + player.radius) {
				// projectile hit a player
				// reward hitter with some HP gain
				let hitterId = proj.playerId;
				players[hitterId].hp += 0.4;
				sockets[hitterId].emit('updatePlayerHp', { hp: players[hitterId].hp });
				
				// penalize hittee with HP loss
                delete projectiles[projId];
                players[playerId].hp--;
                sockets[playerId].emit('updatePlayerHp', { hp: players[playerId].hp });
                if (players[playerId].hp < 1) {
                    // Math.floor(hp) < 1 => player has no discrete hp bars left
                    delete players[playerId];
                    sockets[playerId].emit('killPlayer');
                }
            }
        }
    }
}

function moveProjectiles() {
    for (let id in projectiles) {
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
    for (let id in sockets) {
        sockets[id].emit('updateProjectiles', { projectiles: projectiles });
    }
}

function movePlayers() {
    for (let id in players) {
        let player = players[id];
        if (!player) 
            continue;

        let dir = player.moveDir;
        let isDiag = ((dir & Globals.DIR_UP) && (dir & Globals.DIR_LEFT))
                    || ((dir & Globals.DIR_UP) && (dir & Globals.DIR_RIGHT))
                    || ((dir & Globals.DIR_DOWN) && (dir & Globals.DIR_LEFT))
                    || ((dir & Globals.DIR_DOWN) && (dir & Globals.DIR_RIGHT));
        let l1speed = isDiag ? 
                player.speed / Math.sqrt(2) : player.speed;
        let x = player.x, oldX = player.x;
        let y = player.y, oldY = player.y;

        if (dir & Globals.DIR_UP) {
            y -= l1speed;
        }
        else if (dir & Globals.DIR_DOWN) {
            y += l1speed;
        }

        if (dir & Globals.DIR_LEFT) {
            x -= l1speed;
        }
        else if (dir & Globals.DIR_RIGHT) {
            x += l1speed;
        }
        //else  // dir == Globals.NONE
        player.x = x;
        player.y = y;
        if (checkCollisions(player)) {
            player.x = oldX;
            player.y = oldY;
        }
        if (player.x < 0 || player.x > Globals.DEFAULT_MAP_WIDTH) {
            player.x = oldX;
        }
        if (player.y < 0 || player.y > Globals.DEFAULT_MAP_HEIGHT) {
            player.y = oldY;
        }
        sockets[id].emit('updatePlayerPos', { x: player.x, y: player.y });
    }
}

function spawnPowerups() {
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
    for (let id in sockets) {
        sockets[id].emit('updatePowerups', { powerups: powerups });
    }
    console.log(powerups);
}

function updatePowerupPickups() {
    for (let playerId in players) {
        for (let powerId in powerups) {
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
            }
        }
        sockets[playerId].emit('updatePowerups', { powerups: powerups });
    }
}


function runGame() {
    spawnPowerups();
    function moveLoop() {
        movePlayers();
        moveProjectiles();
    }
    function gameLoop() {
        updateHits();
        deleteOutOfRangeProjectiles();
        updatePowerupPickups();
    }
    setInterval(gameLoop, 50);
    setInterval(moveLoop, 10);
}


