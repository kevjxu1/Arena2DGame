var Canvas = { 

    clearCanvas: function(context) {
        context.beginPath();
        context.fillStyle = Globals.DEFAULT_BACKGROUND_COLOR;
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
        
        // circle border
        context.lineWidth = player.radius * 0.1;
        context.strokeStyle = 'black';
        context.stroke();

        context.closePath();

        //// draw pointer
        //Canvas._displayPointer(context, player);

        // draw player name
        context.font = '12px Arial';
        context.fillStyle = 'black';
        context.textAlign = 'center';
        //context.textBaseline = 'middle';
        context.fillText(player.name, player.x, player.y - player.radius);
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
            context.fillStyle = 'black';
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

    initCanvas: function() {
        canvas = document.getElementById("canvas");
        console.log('canvas: ');
        console.log(canvas);
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


