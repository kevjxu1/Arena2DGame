'use strict';
// This module holds the html5 canvas functions
// initCanvas sets things up

var Canvas = { 

    drawBackground: function(context) {
        context.beginPath();
        context.fillStyle = '#202020';
        context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        context.closePath;
    },

    clearScreen: function(context) {
        context.beginPath()
        context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    },

    drawGrid: function(context, player) {
        // The grid is a visual aid for the mainPlayer's movement

        // draw vertical lines
        let gridGapX = 125;
        let x = SCREEN_WIDTH - (player.x % gridGapX);
        while (x >= 0) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, SCREEN_HEIGHT);
            context.lineWidth = 2;
            context.strokeStyle = '#778899';
            context.stroke();
            context.closePath();
            x -= gridGapX;
        }

        // draw horizontal lines
        let gridGapY = 125;
        let y = SCREEN_HEIGHT - (player.y % gridGapY);
        while (y >= 0) {
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(SCREEN_WIDTH, y);
            context.stroke();
            context.closePath();
            y -= gridGapY;
        }
    },

    drawPlayer: function(context, player, x, y) {
        // draw player icon
        context.beginPath();

        //context.arc(player.x, player.y, player.radius, 0, 2 * Math.PI, true);
        context.arc(x, y, player.radius, 0, 2 * Math.PI, true);
        context.fillStyle = player.color;
        context.fill();
        context.closePath();
        
        // circle border
        let outerR = player.radius * 1.1;
        context.beginPath();
        context.lineWidth = 3;
        context.strokeStyle = '#98FB98';  // pale green
        context.arc(x, y, outerR, 0, 2 * Math.PI, true);
        context.lineWidth = 2; 
        context.stroke();
        context.closePath();

        let hp = Math.floor(player.hp);
        for (let i = 0; i < hp; i++) {
            let startAngle = ((i / hp) * 2 * Math.PI);
            let endAngle = ((i + 1) / hp) * 2 * Math.PI;
            let x1 = x + player.radius * Math.cos(startAngle);
            let y1 = y + player.radius * Math.sin(startAngle);
            let x2 = x + outerR * Math.cos(startAngle);
            let y2 = y + outerR * Math.sin(startAngle);
            context.beginPath();
            context.beginPath();
            context.lineWidth = 6;
            context.strokeStyle = 'black';  // pale green
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.stroke();
            context.closePath();
        }

        //// draw pointer
        //Canvas._displayPointer(context, player);

        // draw player name
        context.font = '12pt Comic Sans MS';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText(player.name, x, y + player.radius + 15);
    },

    drawHpText: function(context, hp, color) {
        context.font = '12pt Comic Sans MS';        
        context.fillStyle = color;
        context.textAlign = 'center';
        context.fillText('HP: ' + hp.toFixed(2), SCREEN_WIDTH / 2, SCREEN_HEIGHT - 16);
    },

    drawVisibleOthers: function(context, visibleOthers, player) {
        for (let id in visibleOthers) {
            let other = visibleOthers[id];
            let xoff = other.x - player.x;
            let yoff = other.y - player.y;
            Canvas.drawPlayer(context, other, SCREEN_WIDTH / 2 + xoff, SCREEN_HEIGHT / 2 + yoff);
        }
    },

    drawProjectiles: function(context, projectiles, player) {
        for (id in projectiles) {
            let proj = projectiles[id];

            let xoff = proj.x - player.x;
            let yoff = proj.y - player.y;
            context.beginPath();
            context.arc(SCREEN_WIDTH / 2 + xoff, SCREEN_HEIGHT / 2 + yoff, 
                    proj.radius, 0, 2 * Math.PI, true);
            context.fillStyle = proj.color;
            context.fill();
            context.closePath();
        }
    },

    drawMapBounds: function(context, mapWidth, mapHeight, player) {
        
        let edgeOfScreen = { 
            top: player.y - SCREEN_HEIGHT / 2,
            left: player.x - SCREEN_WIDTH / 2,
            right: player.x + SCREEN_WIDTH / 2,
            bottom: player.y + 2,
        }

        if (edgeOfScreen.left < 0) {
            let xDistToEdge = player.x;
            context.beginPath();
            context.fillStyle = 'black';
            context.fillRect(0, 0, SCREEN_WIDTH / 2 - xDistToEdge, SCREEN_HEIGHT);
            context.closePath();
        }
        if (edgeOfScreen.right > mapWidth) {
            let xDistToEdge = mapWidth - player.x;
            context.beginPath();
            context.fillStyle = 'black';
            context.fillRect(SCREEN_WIDTH / 2 + xDistToEdge, 0, 
                    SCREEN_WIDTH / 2 - xDistToEdge, 
                    SCREEN_HEIGHT);
            context.closePath();
        }

        if (edgeOfScreen.top < 0) {
            let yDistToEdge = player.y;
            context.beginPath();
            context.fillStyle = 'black';
            context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT / 2 - yDistToEdge);
            context.closePath();
        }
        if (edgeOfScreen.bottom > mapHeight) {
            let yDistToEdge = mapHeight - player.y;
            context.beginPath();
            context.fillStyle = 'black';
            context.fillRect(0, SCREEN_HEIGHT / 2 + yDistToEdge, SCREEN_WIDTH, SCREEN_HEIGHT / 2 - yDistToEdge);
            context.closePath();

        }
    },

    drawPowerups: function(context, powerups) {
        for (id in powerups) {
            let pow = powerups[id];
            let xoff = pow.x - mainPlayer.x;
            let yoff = pow.y - mainPlayer.y;
            let midx = SCREEN_WIDTH / 2;
            let midy = SCREEN_HEIGHT / 2;
            context.beginPath();
            context.moveTo(midx + xoff - DEFAULT_POWERUP_WIDTH, midy + yoff);
            context.lineTo(midx + xoff, midy + yoff - DEFAULT_POWERUP_HEIGHT);
            context.lineTo(midx + xoff + DEFAULT_POWERUP_WIDTH, midy + yoff);
            context.lineTo(midx + xoff, midy + yoff + DEFAULT_POWERUP_HEIGHT);
            context.fillStyle = '#98FB98';  // pale green
            context.fill();
            context.closePath();
        }
    },

    announce: function(context, message) {
        context.font = '18pt Comic Sans MS'
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText(message, SCREEN_WIDTH / 2, 20);
    },

    drawChat: function(context, message, timestamp) {
        // chat box
        context.beginPath();
        context.fillStyle = 'black';
        context.fillRect(0, SCREEN_HEIGHT - 400, 600, 400);
        
        context.font = '14pt Times New Roman';
        context.fillStyle = 'white';
        context.textAlign = 'right';
        context.fillText(timestamp, 0, SCREEN_HEIGHT - 14);
    },

    initCanvas: function() {
        canvas = document.getElementById("canvas");
        canvasBack = document.getElementById("canvasBack");
        canvasFront = document.getElementById("canvasFront");
        canvasFront.width = SCREEN_WIDTH;
        canvasFront.height = SCREEN_HEIGHT;
        canvasBack.width = SCREEN_WIDTH;
        canvasBack.height = SCREEN_HEIGHT;
        contextBack = canvasBack.getContext("2d");
        contextFront = canvasFront.getContext("2d");
    },

    ////////////////////////////////////////////////////////////////
    // helpers
    ////////////////////////////////////////////////////////////////

    _displayPointer: function(context, player) {}
};


