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
    $('#submit').on('click', function(e) {
        //alert('submit callback');
        let nameInput = $('#nameInput').val();
        alert(nameInput);
        Player.player.name = nameInput;
        $('#form').hide();
        IO.socket.emit('addPlayer', { player: Player.player });
    })
});

IO.init();
sendGlobals(Globals);
