var Canvas = { 

    clearCanvas: function(context) {
        context.beginPath();
        //context.fillStyle = Globals.DEFAULT_BACKGROUND_COLOR;
        //context.fillStyle = '#A9A9A9';
        //context.fillStyle = 'black';
        //context.fillStyle = '#404040';
        context.fillStyle = '#202020';
        context.fillRect(0, 0, Globals.SCREEN_WIDTH, Globals.SCREEN_HEIGHT);
        context.closePath;
    },

    drawGrid: function(context, player) {

        // draw vertical lines
        let gridGapX = player.radius * 5;
        let x = Globals.SCREEN_WIDTH - (player.x % gridGapX);
        while (x >= 0) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, Globals.SCREEN_HEIGHT);
            context.lineWidth = 2;
            context.strokeStyle = '#778899';
            context.stroke();
            context.closePath();
            x -= gridGapX;
        }

        // draw horizontal lines
        let gridGapY = player.radius * 5;
        let y = Globals.SCREEN_HEIGHT - (player.y % gridGapY);
        while (y >= 0) {
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(Globals.SCREEN_WIDTH, y);
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
            context.lineWidth = 10;
            context.strokeStyle = 'black';  // pale green
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.stroke();
            context.closePath();
        }

        //context.lineWidth = player.radius * 0.2;
        //context.strokeStyle = 'black';
        //context.stroke();

        //context.closePath();

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
        context.fillText('HP: ' + hp.toFixed(2), Globals.SCREEN_WIDTH / 2, Globals.SCREEN_HEIGHT - 16);
    },

    displayVisibleOthers: function(context, visibleOthers, player) {
        for (let i = 0; i < visibleOthers.length; i++) {
            let other = visibleOthers[i];
            let xoff = other.x - player.x;
            let yoff = other.y - player.y;
            Canvas.drawPlayer(context, other, Globals.SCREEN_WIDTH / 2 + xoff, Globals.SCREEN_HEIGHT / 2 + yoff);
        }
    },

    drawProjectiles: function(context, projectiles, player) {
        for (id in projectiles) {
            let proj = projectiles[id];

            let xoff = proj.x - player.x;
            let yoff = proj.y - player.y;
            context.beginPath();
            context.arc(Globals.SCREEN_WIDTH / 2 + xoff, Globals.SCREEN_HEIGHT / 2 + yoff, 
                    proj.radius, 0, 2 * Math.PI, true);
            context.fillStyle = proj.color;
            context.fill();
            context.closePath();
        }
    },

    drawMapBounds: function(context, mapBounds, player) {
        
        let edgeOfScreen = { 
            top: player.y - Globals.SCREEN_HEIGHT / 2,
            left: player.x - Globals.SCREEN_WIDTH / 2,
            right: player.x + Globals.SCREEN_WIDTH / 2,
            bottom: player.y + Globals.SCREEN_HEIGHT / 2,
        }

        if (edgeOfScreen.left < 0) {
            let xDistToEdge = player.x;
            context.beginPath();
            context.fillStyle = 'black';
            context.fillRect(0, 0, Globals.SCREEN_WIDTH / 2 - xDistToEdge, Globals.SCREEN_HEIGHT);
            context.closePath();
        }
        if (edgeOfScreen.right > mapBounds.rbound) {
            let xDistToEdge = mapBounds.rbound - player.x;
            context.beginPath();
            context.fillStyle = 'black';
            context.fillRect(Globals.SCREEN_WIDTH / 2 + xDistToEdge, 0, 
                    Globals.SCREEN_WIDTH / 2 - xDistToEdge, 
                    Globals.SCREEN_HEIGHT);
            context.closePath();
        }

        if (edgeOfScreen.top < 0) {
            let yDistToEdge = player.y;
            context.beginPath();
            context.fillStyle = 'black';
            context.fillRect(0, 0, Globals.SCREEN_WIDTH, Globals.SCREEN_HEIGHT / 2 - yDistToEdge);
            context.closePath();
        }
        if (edgeOfScreen.bottom > mapBounds.ubound) {
            let yDistToEdge = mapBounds.ubound - player.y;
            context.beginPath();
            context.fillStyle = 'black';
            context.fillRect(0, Globals.SCREEN_HEIGHT / 2 + yDistToEdge, Globals.SCREEN_WIDTH, Globals.SCREEN_HEIGHT / 2 - yDistToEdge);
            context.closePath();

        }
    },

    drawPowerups: function(context, powerups) {
        for (id in powerups) {
            let pow = powerups[id];
            let xoff = pow.x - mainPlayer.x;
            let yoff = pow.y - mainPlayer.y;
            let midx = Globals.SCREEN_WIDTH / 2;
            let midy = Globals.SCREEN_HEIGHT / 2;
            context.beginPath();
            context.moveTo(midx + xoff - Globals.DEFAULT_POWERUP_WIDTH, midy + yoff);
            context.lineTo(midx + xoff, midy + yoff - Globals.DEFAULT_POWERUP_HEIGHT);
            context.lineTo(midx + xoff + Globals.DEFAULT_POWERUP_WIDTH, midy + yoff);
            context.lineTo(midx + xoff, midy + yoff + Globals.DEFAULT_POWERUP_HEIGHT);
            context.fillStyle = '#98FB98';  // pale green
            context.fill();
            context.closePath();
        }
    },

    announce: function(context, message) {
        context.font = '18pt Comic Sans MS'
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText(message, Globals.SCREEN_WIDTH / 2, 20);
    },

    initCanvas: function() {
        canvas = document.getElementById("canvas");
        canvas.width = Globals.SCREEN_WIDTH;
        canvas.height = Globals.SCREEN_HEIGHT;
        context = canvas.getContext("2d");
    },

    ////////////////////////////////////////////////////////////////
    // helpers
    ////////////////////////////////////////////////////////////////

    _displayPointer: function(context, player) {
        let dir = player.dir;
        let ptrHt = player.size / 2;
        //context.fillStyle = player.color;
        context.fillStyle = 'black';
        context.beginPath();
        switch(dir) {
        case Globals.LEFT:
            context.moveTo(player.x, player.y);
            context.lineTo(player.x - ptrHt, player.y + player.size / 2);
            context.lineTo(player.x, player.y + player.size);
            context.fill();
            break;
        case Globals.UP:
            context.moveTo(player.x, player.y);
            context.lineTo(player.x + (player.size / 2), player.y - ptrHt);
            context.lineTo(player.x + player.size, player.y);
            context.fill();
            break;
        case Globals.RIGHT:
            context.moveTo(player.x + player.size, player.y);
            context.lineTo(player.x + player.size + ptrHt, player.y + (player.size / 2));
            context.lineTo(player.x + player.size, player.y + player.size);
            context.fill();
            break;
        case Globals.DOWN:
            context.moveTo(player.x, player.y + player.size);
            context.lineTo(player.x + (player.size / 2), player.y + player.size + ptrHt);
            context.lineTo(player.x + player.size, player.y + player.size);
            context.fill();
            break;
        default:
            break;
        }
        context.closePath();
    }
};


