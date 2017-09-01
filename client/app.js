'use strict'; 

var visibleOthers = [];
var socketId;
var projectiles;
    
var Input = {
	addEventListeners: function() {
		document.addEventListener("keydown", Input.onKeydown, false);
		//document.addEventListener("keyup", Input.onKeyup, false);
	},

	onKeydown: function(e) {
        IO.socket.emit('movePlayer', { keyPressed: e.keyCode });

        if (e.keyCode == Globals.KEY_SPACE) {
            // player shoots projectile
            let proj = new Projectile(
                    Player.player.x, Player.player.y,
                    Globals.DEFAULT_PROJECTILE_THICKNESS,
                    Globals.DEFAULT_PROJECTILE_SPEED,
                    Globals.DEFAULT_PROJECTILE_RANGE,
                    Player.player.dir);
            IO.socket.emit('addProjectile', { proj: proj });
        }
	},
};


////////////////////////////////////////////////////
function gameLoop(context) {
    Canvas.clearCanvas(context);
    //drawPlayer(context, Player.player);
    updateVisibleOthers();
    Canvas.displayVisibleOthers(context, visibleOthers);
    Canvas.drawPlayer(context, Player.player);
    Canvas.displayProjectiles(context, projectiles);
    requestAnimationFrame(function () {
        gameLoop(context);
    });
};

////////////////////////////////////////////////////

function updateVisibleOthers() {
    IO.socket.emit('getVisibleOthers', { player: Player.player });
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
            Player.player.name = nameInput;
            IO.socket.emit('submitForm', { player: Player.player });
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

$(document).ready(function() {
    // process form input on submit
    $('#submit').on('click', function(e) {
        let nameInput = $('#nameInput').val();
        let colorInput = $('.colorInput:checked').val();
        Player.player.name = nameInput;
        Player.player.color = colorInput;
        $('#form').hide();
        IO.socket.emit('addPlayer', { player: Player.player });
    })
});

// initialize socket.io socket
IO.init();

// sync globals with server
sendGlobals(Globals);
