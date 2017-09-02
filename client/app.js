'use strict'; 

var visibleOthers = [];
var socketId;
var projectiles;
var mainPlayer = Player.player;
    
var Input = {
	addEventListeners: function() {
		document.addEventListener("keydown", Input.onKeydown, false);
        document.addEventListener('mousedown', Input.onMousedown, false);
	},

    removeEventListeners: function() {
        document.removeEventListener('keydown', Input.onKeydown);
        document.removeEventListener('mousedown', Input.onMousedown);
    },

	onKeydown: function(e) {
        IO.socket.emit('movePlayer', { keyPressed: e.keyCode });
	},

    onMousedown: function(e) {
        if (e.which == 1) {  // left mouse button
            let rect = canvas.getBoundingClientRect();
            let cursorX = e.clientX - rect.left;
            let cursorY = e.clientY - rect.top;
            let xdiff = cursorX - Globals.SCREEN_WIDTH / 2;
            let ydiff = cursorY - Globals.SCREEN_HEIGHT / 2;
            //mainPlayer.pointerAngle = Math.atan(ydiff / xdiff);
            mainPlayer.pointerAngle = atan2(xdiff, ydiff);
            let proj = new Projectile(
                mainPlayer.x, mainPlayer.y,
                Globals.DEFAULT_PROJECTILE_RADIUS,
                Globals.DEFAULT_PROJECTILE_SPEED,
                Globals.DEFAULT_PROJECTILE_RANGE,
                mainPlayer.pointerAngle,
                mainPlayer.id);
            console.log('cursor x,y: ' + cursorX + ',' + cursorY);
            console.log('aim angle (degrees): ' + mainPlayer.pointerAngle * 360 / (2 * Math.PI));
            IO.socket.emit('addProjectile', { proj: proj });
        }
        else if (e.which == 2) {}  // middle mouse button
        else if (e.which == 3) {}  // right mouse button
        else
            return;
    }

};

function atan2(x, y) {
    let rQuadVal = Math.atan(y / x);
    return (x < 0) ? 
        rQuadVal + Math.PI:
        rQuadVal + (2 * Math.PI);
}

////////////////////////////////////////////////////
function gameLoop(context) {
    Canvas.clearCanvas(context);
    Canvas.drawGrid(context, mainPlayer);
    updateVisibleOthers();
    Canvas.displayVisibleOthers(context, visibleOthers, mainPlayer);
    Canvas.drawPlayer(context, mainPlayer, Globals.SCREEN_WIDTH / 2, Globals.SCREEN_HEIGHT / 2);
    Canvas.drawProjectiles(context, projectiles, mainPlayer);

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
