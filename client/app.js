'use strict'; 

var visiblePlayers = [];
var socketId;
    
var Input = {
	addEventListeners: function() {
		document.addEventListener("keydown", Input.onKeydown, false);
		//document.addEventListener("keyup", Input.onKeyup, false);
	},

	onKeydown: function(e) {
        IO.socket.emit('movePlayer', { keyPressed: e.keyCode });
	},
};


////////////////////////////////////////////////////
function gameLoop(context) {
    Canvas.clearCanvas(context);
    //displayPlayer(context, Player.player);
    updateVisiblePlayers();
    Canvas.displayVisiblePlayers(context, visiblePlayers);
    Canvas.displayPlayer(context, Player.player);
    requestAnimationFrame(function () {
        gameLoop(context);
    });
};

////////////////////////////////////////////////////

function updateVisiblePlayers() {
    IO.socket.emit('getVisiblePlayers', { player: Player.player });
}

function createPlayer() {
    //if (!IO.sockId)
    //    return;
    IO.socket.emit('addPlayer', { player: Player.player });
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
