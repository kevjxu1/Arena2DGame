'use strict'; 

var visiblePlayers = [];
var socketId;
    
var Globals = {
    // game parameters
	DEFAULT_PLAYER_SIZE: 28, 
    DEFAULT_PLAYER_SPEED: 4,                                                     
    DEFAULT_PLAYER_VISION: 100,

    SCREEN_WIDTH: window.innerWidth * 0.7,
    SCREEN_HEIGHT: window.innerHeight * 0.7,

    // input constants
    KEY_UNPRESSED: -1,
    KEY_ENTER: 13,
    KEY_LEFT: 37,
    KEY_UP: 38,
    KEY_RIGHT: 39,
    KEY_DOWN: 40

};

var Player =  {
    player: {
        name: '',
        color: 'red',
        size: Globals.DEFAULT_PLAYER_SIZE,
        speed: Globals.DEFAULT_PLAYER_SPEED,
        vision: Globals.DEFAULT_PLAYER_VISION,
        x: Globals.SCREEN_WIDTH / 2,  
        y: Globals.SCREEN_HEIGHT / 2
    }
};

//var socket;
//function initIO() {
//    socket = io.connect();
//    bindEvents();
//}
//
//function bindEvents() {
//    socket.on('connection
//}

var IO = {
	init: function() {
		IO.socket = io.connect();
		IO.bindEvents();
	},

    bindEvents: function() {
        //IO.socket.on('createPlayer', IO.createPlayer);
        IO.socket.on('connection', function() {
            //socketId = IO.socket.socket.sessionid;
            socketId = io.socket.sessionid;
        });
        IO.socket.on("updatePlayer", IO.updatePlayer);

        IO.socket.on('updateVisiblePlayers', function(msg) {
            visiblePlayers = msg.visiblePlayers;
        });
    },

    updatePlayer: function(player) {
        Player.player = player;
    }

};

var Input = {
    
	addEventListeners: function() {
		document.addEventListener("keydown", Input.onKeydown, false);
		//document.addEventListener("keyup", Input.onKeyup, false);
	},

	onKeydown: function(e) {
        IO.socket.emit('movePlayer', { keyPressed: e.keyCode });
	},
	
	//onKeyup: function(e) {
    //    IO.socket.emit(IO.socket, e.keyCode)
	//}
};

////////////////////////////////////////////////////
// Draw on screen
////////////////////////////////////////////////////

// helpers

function clearCanvas(context) {
    context.beginPath();
    context.fillStyle = '#CCCFD3';  // light gray
    context.fillRect(0, 0, Globals.SCREEN_WIDTH, Globals.SCREEN_HEIGHT);
    context.closePath;
}

function displayPlayer(context, player) {
    context.beginPath();
    context.rect(player.x, player.y, player.size, player.size);
    context.fillStyle = player.color;
    context.fill();
    context.closePath();
}

function displayVisiblePlayers(context) {
    for (let i = 0; i < visiblePlayers.length; i++) {
        let p = visiblePlayers[i];
        console.log('displaying player: ');
        console.log(p);

        displayPlayer(context, p);
    }
}


// top modules

function loopDisplay(context) {
    clearCanvas(context);
    //displayPlayer(context, Player.player);
    updateVisiblePlayers();
    displayVisiblePlayers(context);
    requestAnimationFrame(function () {
        loopDisplay(context);
    });
};

function initCanvas(canvas) {
    canvas = document.getElementById("canvas");
    canvas.width = Globals.SCREEN_WIDTH;
    canvas.height = Globals.SCREEN_HEIGHT;
    context = canvas.getContext("2d");
}

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

IO.init();
sendGlobals(Globals);

Input.addEventListeners();
createPlayer();

var canvas,
    context;
initCanvas(canvas);
loopDisplay(context);

