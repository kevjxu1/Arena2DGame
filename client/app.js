'use strict'; 

var visibleOthers = {};
var socketId;
var projectiles = {};
var mainPlayer = Player.player;
var mapBounds = {
    rbound: Globals.DEFAULT_MAP_WIDTH,
    ubound: Globals.DEFAULT_MAP_HEIGHT
}
var powerups;
var timeLastFired = 0;
var timeLastAnnounced = 0;
var announceMessage = '';
var playerDead = false;
    
var Input = {
	addEventListeners: function() {
        document.addEventListener('mousemove', Input.onMousemove, false);
		document.addEventListener("keydown", Input.onKeydown, false);
        document.addEventListener('keyup', Input.onKeyup, false);
        document.addEventListener('mousedown', Input.onMousedown, false);
        document.addEventListener('keydown', Input.onSpaceDown, false);
	},

    removeEventListeners: function() {
        document.removeEventListener('keydown', Input.onKeydown);
        document.removeEventListener('mousedown', Input.onMousedown);
        document.removeEventListener('keyup', Input.onKeyup);
        document.removeEventListener('keydown', Input.onSpaceDown);
        document.removeEventListener('mousemove', Input.onMousemove);
    },

    onMousemove: function(e) {
        let rect = canvas.getBoundingClientRect();
        let cursorX = e.clientX - rect.left;
        let cursorY = e.clientY - rect.top;
        let xdiff = cursorX - Globals.SCREEN_WIDTH / 2;
        let ydiff = cursorY - Globals.SCREEN_HEIGHT / 2;
        mainPlayer.angle = atan2(xdiff, ydiff);
    },

	onKeydown: function(e) {
        switch (e.keyCode) {
        case Globals.KEY_W:
        case Globals.KEY_UP:
            mainPlayer.moveDir |= Globals.DIR_UP;
            break;
        case Globals.KEY_A:
        case Globals.KEY_LEFT:
            mainPlayer.moveDir |= Globals.DIR_LEFT;
            break;
        case Globals.KEY_D:
        case Globals.KEY_RIGHT:
            mainPlayer.moveDir |= Globals.DIR_RIGHT;
            break;
        case Globals.KEY_S:
        case Globals.KEY_DOWN:
            mainPlayer.moveDir |= Globals.DIR_DOWN;
            break;
        default:
            break;
        }
        IO.socket.emit('updatePlayerDir', { moveDir: mainPlayer.moveDir });
	},

    onKeyup: function(e) {
        // halt movement
        let dir = Globals.DIR_NONE;

        switch (e.keyCode) {
        case Globals.KEY_W:
        case Globals.KEY_UP:
            dir |= Globals.DIR_UP;
            break;
        case Globals.KEY_A:
        case Globals.KEY_LEFT:
            dir |= Globals.DIR_LEFT;
            break;
        case Globals.KEY_D:
        case Globals.KEY_RIGHT:
            dir |= Globals.DIR_RIGHT;
            break;
        case Globals.KEY_S:
        case Globals.KEY_DOWN:
            dir |= Globals.DIR_DOWN;
            break;
        default:
            break;
        }
        mainPlayer.moveDir &= (~dir & 0xF);
        IO.socket.emit('updatePlayerDir', { moveDir: mainPlayer.moveDir });
    },

    onMousedown: function(e) {
        if (e.which == 1) {  // left mouse button
            if (new Date().getTime() - timeLastFired < mainPlayer.reloadTime) {
                // mainPlayer has not reloaded yet
                return;
            }
            timeLastFired = new Date().getTime();
            let proj = new Projectile(
                mainPlayer.x, mainPlayer.y,
                Globals.DEFAULT_PROJECTILE_RADIUS,
                Globals.DEFAULT_PROJECTILE_SPEED,
                Globals.DEFAULT_PROJECTILE_RANGE,
                mainPlayer.angle,
                mainPlayer.id, mainPlayer.color);
            IO.socket.emit('addProjectile', { proj: proj });
        }
        else if (e.which == 2) {}  // middle mouse button
        else if (e.which == 3) {  // right mouse button
            switch(mainPlayer.powerup) {
            case Globals.POWER_CANNON:
                let proj = new Projectile(
                    mainPlayer.x, mainPlayer.y,
                    100, 4, 900,
                    mainPlayer.angle,
                    mainPlayer.id, mainPlayer.color);
                IO.socket.emit('addProjectile', { proj: proj });
                proj.angle = proj.angle * 180 / Math.PI;
                mainPlayer.powerup = Globals.POWER_NONE;
                break;
            default:  // Globals.POWER_NONE
                break;
            }       
        }  // end right mouse button
        else
            return;
    },

};

function getDistance(circle1, circle2) {
    let xdiff = circle2.x - circle1.x;
    let ydiff = circle2.y - circle1.y;
    let dist = Math.sqrt((xdiff * xdiff) + (ydiff * ydiff));
    return dist;
}

function checkCollisions(player, visibleOthers) {
    for (let i = 0; i < visibleOthers.length; i++) {
        let other = visibleOthers[i];
        let dist = getDistance(other, player);
        if (dist < player.radius + other.radius) {
            // collision detected
            return true;
        }
    }
    return false;
}

function atan2(x, y) {
    let rQuadVal = Math.atan(y / x);
    return (x < 0) ? 
        rQuadVal + Math.PI:
        rQuadVal + (2 * Math.PI);
}

function killPlayer() {
    playerDead = true;
    console.log('player died');
	IO.socket.off('updatePlayerPos');
	IO.socket.off('updatePlayerPowerup');
	IO.socket.off('updatePlayerHp');
    IO.socket.off('movePlayer');
	IO.socket.off('updateProjectiles');                                    
	Input.removeEventListeners();                                          
    
    let x = mainPlayer.x;
    let y = mainPlayer.y;
    mainPlayer = { x: x, y: y };
	//mainPlayer = null;                                                     
    IO.socket.emit('playerDied');
}

function sendGlobals() {
    IO.socket.emit('updateGlobals', { Globals: Globals });
}

function clearForm() {
    let form = document.getElementById('form');
    form.style.display = 'none';
}

// initialize socket.io socket
IO.init();

$(document).ready(function() {
    // disable right-click context menu on canvas
    $('body').on('contextmenu', '#canvas', function(e) { return false; });

    // process form input on submit
    $('#submit').on('click', function(e) {
        let nameInput = $('#nameInput').val();
        let colorInput = $('.colorInput:checked').val();
        mainPlayer.name = nameInput;
        mainPlayer.color = colorInput;
        $('#frontPage').hide();
        IO.socket.emit('addPlayer', { player: mainPlayer });
    })
});

// sync globals with server
sendGlobals(Globals);


////////////////////////////////////////////////////
function gameLoop(context) {
    Canvas.clearCanvas(context);

    Canvas.drawGrid(context, mainPlayer);
    Canvas.drawVisibleOthers(context, visibleOthers, mainPlayer);
    Canvas.drawPowerups(context, powerups);
    if (!playerDead) {
        Canvas.drawPlayer(context, mainPlayer, Globals.SCREEN_WIDTH / 2, Globals.SCREEN_HEIGHT / 2);
    }
    Canvas.drawProjectiles(context, projectiles, mainPlayer);
    Canvas.drawMapBounds(context, mapBounds, mainPlayer);
    if (!playerDead) {
        Canvas.drawHpText(context, mainPlayer.hp, mainPlayer.color);
    }
    if (announceMessage != '') {
        if (new Date().getTime() - timeLastAnnounced < 3500) {
            Canvas.announce(context, announceMessage);
        }
        else {
            announceMessage = '';
        }
    }

    if (!playerDead)
        requestAnimationFrame(function () {
            gameLoop(context);
        });
};


////////////////////////////////////////////////////


