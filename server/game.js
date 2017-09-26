"use strict";
// This module holds the main game logic.

var defaults = require('./defaults.js');

var players = {};
var sockets = {};
var projectiles = {};
//var powerups = {};

// we may want map bounds to dynamically adjust (in case of overcrowding) 
var mapWidth = defaults.DEFAULT_MAP_WIDTH;
var mapHeight = defaults.DEFAULT_MAP_HEIGHT;

// class Player
var Player = require('./player.js'); 

// class Projectile
var Projectile = require('./projectile.js');

var dirs = require('./dirs.js');

module.exports.socketSetup = {

    connectSocket: function(io, socket) {
        console.log('socket.id: ' + socket.id);
		sockets[socket.id] = socket;

        socket.on('disconnect', function() {
            console.log('deleting player[' + socket.id + ']');
            delete players[socket.id];
            delete sockets[socket.id];

            for (let id in sockets) {
                sockets[id].emit('rmVisibleOther', { id: socket.id });
            }
        });

        // msg: { name, color }
        socket.on('addPlayer', function(msg) {
            let x, y;

            // spawn player at random (x,y) that doesn't collide with another
            console.log('randomizing new player position');
            while (true) {
                x = Math.floor(Math.random() * mapWidth);
                y = Math.floor(Math.random() * mapHeight);

                // check if any player is colliding if new player spawns at (x,y)
                if (collidesWithPlayer(
                        { x: x, y: y, radius: defaults.DEFAULT_PLAYER_RADIUS }))
                    continue;
                else
                    break;
            }

            players[socket.id] = new Player({
                    id: socket.id, 
                    name: msg.name,
                    color: msg.color,
                    x: x, y: y });

            // tell client to join game with newly created player.
            // Also, give the client (1) map bounds and (2) direction encoding
            socket.emit('joinGame', { 
                player: players[socket.id], 
                mapWidth: mapWidth,
                mapHeight: mapHeight,
                dirs: dirs });
        });

        socket.on('updatePlayerAngle', function(msg) {
            let angle = msg.angle;
            if (players[socket.id])
                players[socket.id].angle = angle;
        });

        socket.on('updatePlayerDir', function(msg) {
            let moveDir = msg.moveDir;
            if (players[socket.id])
                players[socket.id].moveDir = moveDir;
        });
        
        socket.on('addProjectile', function(msg) {
            if (!msg.dir) {
                return;
            }
            let proj = new Projectile({ 
                    x: msg.x, y: msg.y, dir: msg.dir,
                    playerId: msg.playerId, color: msg.color });
            let projId = new Date().valueOf() + '-' +
                    proj.x.toString() + '-' + proj.y.toString();
            projectiles[projId] = proj;

            // tell all clients that a new projectile is on the map
            for (let sid in sockets) {
                sockets[sid].emit('addProjectile', { id: projId, proj: proj });
            }
        });

        // msg: { name, ts, text }
        socket.on('sendChatMessage', function(msg) {
            // broadcast to all clients the chat log message
            for (let sid in sockets) {
                sockets[sid].emit('receiveChatMessage', {
                        name: msg.name,
                        ts: msg.ts,
                        text: msg.text });
            }
        });

    },
};

function deleteOutOfRangeProjectiles() {
    for (let projId in projectiles) {
        let proj = projectiles[projId];
        let xdiff = proj.x - proj.startX;
        let ydiff = proj.y - proj.startY;
        let dist = Math.sqrt((xdiff * xdiff) + (ydiff * ydiff));
        if (dist > proj.range) {
            delete projectiles[projId]; 
            console.log('projectile deleted: ' + projId);
            for (let id in sockets) {
                sockets[id].emit('rmProjectile', { id: projId });
            }
        }

        if (proj.x < 0 || proj.x > mapWidth 
                || proj.y < 0 || proj.y > mapHeight)
        {
            // projectile hit the map edge
            delete projectiles[projId];
            console.log('projectile deleted: ' + projId);
            for (let id in sockets) {
                sockets[id].emit('rmProjectile', { id: projId });
            }
        }
    }
}

//////////////////////////////////////////////////////////////////////
// Utilities
//////////////////////////////////////////////////////////////////////

// cir: { id, x, y, radius }
function collidesWithPlayer(cir) {
    for (let id in players) {
        if (id == cir.id) {
            // We don't consider collisions with itself
            continue;
        }
        let p = players[id];
        let xdiff = cir.x - p.x;
        let ydiff = cir.y - p.y;
        let dist = Math.sqrt((xdiff * xdiff) + (ydiff * ydiff));
        if (dist < cir.radius + p.radius) {
            // collision detected
            return true;
        }
    }
    return false;
}

// p1, p2: { x, y }
function getL2Distance(p1, p2) {
    let xdist = Math.abs(p2.x - p1.x);
    let ydist = Math.abs(p2.y - p1.y)
    return Math.sqrt((xdist * xdist) + (ydist * ydist));
}

//function generatePowerup(player) {
//    player.powerup = Globals.POWER_CANNON;
//    sockets[player.id].emit('updatePlayerPowerup', { powerup: player.powerup });
//}

//////////////////////////////////////////////////////////////////////


function updateHits() {
    // if a projectile hits player, projectile dies, player loses hitpoints
    // currently, we have life steal
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

                // delete projectile
                delete projectiles[projId];
                for (let sid in sockets) {
                    sockets[sid].emit('rmProjectile', { id: projId });
                }

				// reward hitter with some HP gain
				let hitterId = proj.playerId;
                if (players[hitterId]) {
                    players[hitterId].hp += 0.4;
                    sockets[hitterId].emit('updatePlayerHp', { hp: players[hitterId].hp });
                }
				
				// penalize hittee with HP loss
                if (players[playerId]) {
                    players[playerId].hp--;
                    sockets[playerId].emit('updatePlayerHp', { hp: players[playerId].hp });

                    if (players[playerId].hp < 1) {
                        // Math.floor(hp) < 1 => player has no discrete hp bars left
                        delete players[playerId];
                        sockets[playerId].emit('killPlayer');
                        for (let sid in sockets) {
                            sockets[sid].emit('rmVisibleOther', { id: playerId });
                        }
                    }
                }
                
            }
        }
    }
}

function moveProjectiles() {
    // tick each projectile's x and y
    for (let projId in projectiles) {
        let proj = projectiles[projId];

        if (proj) {
            let dx = Math.cos(proj.dir) * proj.speed;
            let dy = Math.sin(proj.dir) * proj.speed;
            proj.x += dx;
            proj.y += dy;

            // tell every client projectile's new position
            for (let sid in sockets) {
                sockets[sid].emit('updateProjectilePos', 
                        { id: projId, x: proj.x, y: proj.y });
            }
        }
    }
}

function movePlayers() {
    for (let id in players) {
        let player = players[id];
        if (!player) 
            continue;

        let dir = player.moveDir;
        let isDiag = ((dir & dirs.DIR_UP) && (dir & dirs.DIR_LEFT))
                    || ((dir & dirs.DIR_UP) && (dir & dirs.DIR_RIGHT))
                    || ((dir & dirs.DIR_DOWN) && (dir & dirs.DIR_LEFT))
                    || ((dir & dirs.DIR_DOWN) && (dir & dirs.DIR_RIGHT));

        // l2 speed must be constant <=> 
        // diagonal => x and y speeds scale down by sqrt(2)
        let l1speed = isDiag ? 
                player.speed / Math.sqrt(2) : player.speed;
        let x = player.x, oldX = player.x;
        let y = player.y, oldY = player.y;

        // tick player's x and y
        if (dir & dirs.DIR_UP) {
            y -= l1speed;
        }
        else if (dir & dirs.DIR_DOWN) {
            y += l1speed;
        }
        if (dir & dirs.DIR_LEFT) {
            x -= l1speed;
        }
        else if (dir & dirs.DIR_RIGHT) {
            x += l1speed;
        }
        //else (dir == dirs.DIR_NONE) { do nothing }

        player.x = x;
        player.y = y;

        // prevent collisions
        if (collidesWithPlayer(player)) {
            player.x = oldX;
            player.y = oldY;
        }
        if (player.x < 0 || player.x > mapWidth) {
            player.x = oldX;
        }
        if (player.y < 0 || player.y > mapHeight) {
            player.y = oldY;
        }
        //console.log('(' + player.x + ', ' + player.y + ')');

        sockets[id].emit('updatePlayerPos', { x: player.x, y: player.y });
    }
}

//function spawnPowerups() {
//    while (Object.keys(powerups).length < Globals.DEFAULT_MAP_MAX_POWERUPS) {
//        let x = Math.floor(Math.random() * mapWidth);
//        let y = Math.floor(Math.random() * mapHeight);
//        let powerup = {
//            x: x,
//            y: y,
//        };
//        let id = Object.keys(powerups).length;
//        console.log('created powerup: ' + id);
//        powerups[id] = powerup;
//    }
//    for (let id in sockets) {
//        sockets[id].emit('updatePowerups', { powerups: powerups });
//    }
//    console.log(powerups);
//}

//function updatePowerupPickups() {
//    for (let playerId in players) {
//        for (let powerId in powerups) {
//            let player = players[playerId];
//            let powerup = powerups[powerId];
//            if (getL2Distance(player, powerup) <= player.radius) {
//                // player gets powerup
//                let powerName = generatePowerup(player);    
//                delete powerups[powerId];
//                console.log('deleted powerup ' + powerId);
//                console.log('player: ' + player.id + ' gets powerup');
//                powerups[powerId] = {
//                    x: Math.floor((Math.random() * mapWidth - Globals.DEFAULT_POWERUP_WIDTH) + 1),
//                    y: Math.floor((Math.random() * mapHeight - Globals.DEFAULT_POWERUP_HEIGHT) + 1)
//                }
//                console.log('created powerup ' + powerId);
//            }
//        }
//        sockets[playerId].emit('updatePowerups', { powerups: powerups });
//    }
//}

// TODO: if we're not doing vision, then maybe implementation should change
function updateVisibleOthers() {
    for (let id1 in players) {
        for (let id2 in players) {
            if (id1 == id2) 
                continue;
            let p1 = players[id1];
            let p2 = players[id2];
            if (getL2Distance(p1, p2) <= p1.vision) {
                sockets[id1].emit('addVisibleOther', { player: p2 });
            }
        }
    }
}

function runGame() {
    console.log('running game')
    //spawnPowerups();
    function moveLoop() {
        movePlayers();
        moveProjectiles();
    }
    function gameLoop() {
        updateVisibleOthers();
        updateHits();
        deleteOutOfRangeProjectiles();
        //updatePowerupPickups();
    }
    setInterval(gameLoop, 50);
    setInterval(moveLoop, 10);
}
exports.runGame = runGame;
