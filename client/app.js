'use strict'; 

var Globals = requre('/../globals');

var IO = {
	init: function() {
		IO.socket = io.connect();
		//IO.bindEvents();
	},

};

var Input = {
	keyPressed: Globals.KEY_UNPRESSED,

	addEventListeners: function() {
		document.addEventListener("keydown", Input.onKeydown, false);
		document.addEventListener("keyup", Input.onKeyup, false);
	},

	onKeydown: function(e) {
		Input.keyPressed = e.keyCode;
		App.player.move(Input.keyPressed);
	},
	
	onKeyup: function(e) {
		Input.keyPressed = Globals.KEY_UNPRESSED;
		App.player.move(Input.keyPressed);
	}
};

var App = { 

    visiblePlayers: [],

    Canvas:  {

        clear: function(context) {
            context.beginPath();
            context.fillStyle = '#CCCFD3';  // light gray
            context.fillRect(0, 0, Globals.CANVAS_WIDTH, Globals.CANVAS_HEIGHT);
            context.closePath;
        },

        displayPlayer: function(context, player) {
            context.beginPath();
            context.rect(player.x, player.y, Globals.PLAYER_SIZE, Globals.PLAYER_SIZE);
            context.fillStyle = player.color;
            context.fill();
            context.closePath();
        },

        displayPlayers: function(context) {
            
        },

        mspf: 1,  // milliseconds per frame

        loopDisplay: function(context) {
			App.Canvas.clear(context);
            App.Canvas.displayPlayer(context, App.player);
            requestAnimationFrame(function () {
				App.Canvas.loopDisplay(context);
			});
        }
    },

    player: {
        name:  '',
        color:  'red', 
        x: Globals.CANVAS_WIDTH / 2,
		y: Globals.CANVAS_HEIGHT / 2,

		move: function(dir) {
			switch (dir) {
				case Globals.KEY_UP:
					this.y -= Globals.PLAYER_SPEED;
					break;
				case Globals.KEY_RIGHT:
					this.x += Globals.PLAYER_SPEED;
					break;
				case Globals.KEY_DOWN:
					this.y += Globals.PLAYER_SPEED;
					break;
				case Globals.KEY_LEFT:
					this.x -= Globals.PLAYER_SPEED;
					break;
				default:
					break;
			}
		}
    },

};

IO.init();
Input.addEventListeners();
var canvas = document.getElementById("canvas");
canvas.width = Globals.CANVAS_WIDTH;;
canvas.height = Globals.CANVAS_HEIGHT;
var context = canvas.getContext("2d");
App.Canvas.loopDisplay(context);

