'use strict'; 

const PLAYER_SIZE = 10;
const CANVAS_WIDTH = window.innerWidth * 0.7;
const CANVAS_HEIGHT = window.innerHeight * 0.7;

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

    visiblePlayers: [],

    clear: function(context) {
        context.beginPath();
        context.fillStyle = '#CCCFD3';
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.closePath;
    },

    drawPlayer: function(player, context) {
        context.beginPath();
        let centerX = CANVAS_WIDTH / 2;
        let centerY = CANVAS_HEIGHT / 2;
        context.rect(centerX, centerY, PLAYER_SIZE, PLAYER_SIZE);
		ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    },

    drawPlayers: function() {
        
    }
}

var canvas = document.getElementById("canvas");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
var context = canvas.getContext("2d");
Canvas.clear(context);

IO.init();
