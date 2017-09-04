'use strict'; 

var visibleOthers = [];
var socketId;
var projectiles;
var mainPlayer = Player.player;
var mapBounds = {
    rbound: Globals.DEFAULT_MAP_WIDTH,
    ubound: Globals.DEFAULT_MAP_HEIGHT
}
var powerups;
var timeLastFired = 0;
    
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
        //mainPlayer.pointerAngle = Math.atan(ydiff / xdiff);
        mainPlayer.pointerAngle = atan2(xdiff, ydiff);
        console.log('angle: ' + mainPlayer.pointerAngle * 180 / Math.PI);
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
        IO.socket.emit('updatePlayer', { player: mainPlayer });
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
        IO.socket.emit('updatePlayer', { player: mainPlayer });
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
                mainPlayer.pointerAngle,
                mainPlayer.id);
            IO.socket.emit('addProjectile', { proj: proj });
        }
        else if (e.which == 2) {}  // middle mouse button
        else if (e.which == 3) {
            switch(mainPlayer.powerup) {
            case Globals.POWER_CANNON:
                let proj = new Projectile(
                    mainPlayer.x, mainPlayer.y,
                    75, 10, 800,
                    mainPlayer.pointerAngle,
                    mainPlayer.id);
                IO.socket.emit('addProjectile', { proj: proj });
                mainPlayer.powerup = Globals.POWER_NONE;
                break;
            default:  // Globals.POWER_NONE
                break;
            }       
        }  // right mouse button
        else
            return;
    },

    onSpaceDown: function(e) {
        if (e.keyCode == Globals.KEY_SPACE) {
            switch(mainPlayer.powerup) {
            case Globals.POWER_CANNON:
                let proj = new Projectile(
                    mainPlayer.x, mainPlayer.y,
                    75, 10, 800,
                    mainPlayer.pointerAngle,
                    mainPlayer.id);
                IO.socket.emit('addProjectile', { proj: proj });
                mainPlayer.powerup = Globals.POWER_NONE;
                break;
            default:  // Globals.POWER_NONE
                break;
            }
        }
    }
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
        //let xdiff = player.x - other.x;
        //let ydiff = player.y - other.y;
        //let dist = Math.sqrt((xdiff * xdiff) + (ydiff * ydiff));
        if (dist < player.radius + other.radius) {
            // collision detected
            return true;
        }
    }
    return false;
}

// did mainPlayer get hit?
function checkHit() {
    for (id in projectiles) {
        let proj = projectiles[id];
		if (proj.playerId == mainPlayer.id)
			continue;
        let dist = getDistance(proj, mainPlayer);
        if (dist < mainPlayer.radius + proj.radius) {
            return true;
        }
    }
}

function atan2(x, y) {
    let rQuadVal = Math.atan(y / x);
    return (x < 0) ? 
        rQuadVal + Math.PI:
        rQuadVal + (2 * Math.PI);
}

function killPlayer() {
	IO.socket.off('updatePlayer');                                         
    IO.socket.off('movePlayer');
	IO.socket.off('updateVisibleOthers');                                  
	IO.socket.off('updateProjectiles');                                    
	Input.removeEventListeners();                                          
	mainPlayer = null;                                                     
    IO.socket.emit('playerDied');
	alert('You died');
}

////////////////////////////////////////////////////
function gameLoop(context) {
    Canvas.clearCanvas(context);

    if (mainPlayer) {
        Canvas.drawGrid(context, mainPlayer);
        updateVisibleOthers();
        Canvas.displayVisibleOthers(context, visibleOthers, mainPlayer);
        Canvas.drawPowerups(context, powerups);
        Canvas.drawPlayer(context, mainPlayer, Globals.SCREEN_WIDTH / 2, Globals.SCREEN_HEIGHT / 2);
        Canvas.drawProjectiles(context, projectiles, mainPlayer);
        Canvas.drawMapBounds(context, mapBounds, mainPlayer);
        //if (checkHit()) {
        //    killPlayer();
        //}
    }

    requestAnimationFrame(function () {
        gameLoop(context);
    });
};

////////////////////////////////////////////////////

function updateVisibleOthers() {
    IO.socket.emit('getVisibleOthers', { player: mainPlayer });
}

function sendGlobals() {
    IO.socket.emit('updateGlobals', { Globals: Globals });
}

function onSubmit() {
    console.log('onSubmit callback');
    form = document.getElementById('form');
    for (let i = 0; i < form.length; i++) {
        if (form.elements[i].id == 'nameInput') {
            let nameInput = form.elements[i].value;
            mainPlayer.name = nameInput;
            IO.socket.emit('submitForm', { player: mainPlayer });
            break;
        }
    }
}

function bindSubmit() {
    let form = document.getElementById('form');
    for (let i = 0; i < form.length; i++) {
        if (form.elements[i].id == 'submit') {
            //form.elements[i].onclick='onSubmit();';
            form.elements[i].addEventListener('click', onSubmit);
            console.log(form.elements[i].value + ' binded');
            break;
        }
    }
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
        $('#form').hide();
        IO.socket.emit('addPlayer', { player: mainPlayer });
    })
});


// sync globals with server
sendGlobals(Globals);
