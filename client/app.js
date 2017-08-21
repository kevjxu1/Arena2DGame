'use strict'; 

const PLAYER_SIZE = 20;

var IO = {
	init: function() {
		IO.socket = io.connect();
		//IO.bindEvents();
	},

	//bindEvents: function() {
	//	IO.socket.on('connected', IO.onConnected);
	//},
	//
	//onConnected: function(data) {
    //    
	//}	
};

var Canvas = {
    CANVAS_WIDTH: window.innerWidth * 0.7,
    CANVAS_HEIGHT: window.innerHeight * 0.7,

    getCenter: function() {
        return { x: Canvas.CANVAS_WIDTH / 2, y: Canvas.CANVAS_HEIGHT / 2 };
    },

    visiblePlayers: [],

    clear: function(context) {
        context.beginPath();
        context.fillStyle = '#CCCFD3';
        context.fillRect(0, 0, Canvas.CANVAS_WIDTH, Canvas.CANVAS_HEIGHT);
        context.closePath;
    },

    drawPlayer: function(player, context) {
        context.beginPath();
        context.rect(player.pos.x, player.pos.y, PLAYER_SIZE, PLAYER_SIZE);
		context.fillStyle = player.color;
        context.fill();
        context.closePath();
    },

    drawPlayers: function() {
        
    }
}

class Player {
    constructor(name='', color='red', pos) {
        this.name = name;
        if (!pos)
            this.pos = Canvas.getCenter();
        else
            this.pos = pos;
        this.color = color;
    }
}

IO.init();

var canvas = document.getElementById("canvas");
canvas.width = Canvas.CANVAS_WIDTH;
canvas.height = Canvas.CANVAS_HEIGHT;
var context = canvas.getContext("2d");
Canvas.clear(context);

var player = new Player('', 'red', Canvas.getCenter());
Canvas.drawPlayer(player, context);

