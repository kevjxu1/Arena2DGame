var canvas,
    context;

var Canvas = { 

    clearCanvas: function(context) {
        context.beginPath();
        context.fillStyle = Globals.DEFAULT_BACKGROUND_COLOR;
        context.fillRect(0, 0, Globals.SCREEN_WIDTH, Globals.SCREEN_HEIGHT);
        context.closePath;
    },

    displayPlayer: function(context, player) {
        // draw player icon
        context.beginPath();
        context.rect(player.x, player.y, player.size, player.size);
        context.fillStyle = player.color;
        context.fill();
        context.closePath();

        // draw pointer
        Canvas._displayPointer(context, player);

        // draw player name
        context.font = '12px Arial';
        context.fillStyle = 'black';
        context.textAlign = 'center';
        //context.textBaseline = 'middle';
        context.fillText(player.name, player.x + (player.size / 2), player.y);
    },

    displayVisibleOthers: function(context, visibleOthers) {
        for (let i = 0; i < visibleOthers.length; i++) {
            let p = visibleOthers[i];
            Canvas.displayPlayer(context, p);
        }
    },

    displayProjectiles: function(context, projectiles) {
        for (id in projectiles) {
            let proj = projectiles[id];
            context.beginPath();
            context.rect(proj.x, proj.y, proj.thickness, proj.thickness);
            context.fillStyle = 'black';
            context.fill();
            context.closePath();
        }
    },

    initCanvas: function(canvas) {
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


