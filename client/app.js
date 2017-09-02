'use strict'; 

var visibleOthers = [];
var socketId;
var projectiles;
var mainPlayer = Player.player;
var playerAlive = true;
    
var Input = {
	addEventListeners: function() {
		document.addEventListener("keydown", Input.onKeydown, false);
	},

	onKeydown: function(e) {
        if (!playerAlive) {
            return;
        }

        IO.socket.emit('movePlayer', { keyPressed: e.keyCode });

        if (e.keyCode == Globals.KEY_SPACE) {
            // player shoots projectile
            let proj = new Projectile(
                    mainPlayer.x, mainPlayer.y,
                    Globals.DEFAULT_PROJECTILE_THICKNESS,
                    Globals.DEFAULT_PROJECTILE_SPEED,
                    Globals.DEFAULT_PROJECTILE_RANGE,
                    mainPlayer.dir,
                    mainPlayer.id);
            IO.socket.emit('addProjectile', { proj: proj });
        }
	},

};


////////////////////////////////////////////////////
function gameLoop(context) {
    Canvas.clearCanvas(context);
    //drawPlayer(context, mainPlayer);
    updateVisibleOthers();
    Canvas.displayVisibleOthers(context, visibleOthers);
    if (playerAlive)
        Canvas.drawPlayer(context, mainPlayer);
    Canvas.drawProjectiles(context, projectiles);
    requestAnimationFrame(function () {
        gameLoop(context);
    });
};

////////////////////////////////////////////////////

function updateVisibleOthers() {
    IO.socket.emit('getVisibleOthers', { player: mainPlayer });
}

function sendGlobals() {
    IO.socket.emit('updateGlobals', Globals);
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
