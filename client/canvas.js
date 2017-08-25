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

        // draw player name
        context.font = '12px Arial';
        context.fillStyle = 'black';
        context.textAlign = 'center';
        //context.textBaseline = 'middle';
        context.fillText(player.name, player.x + (player.size / 2), player.y);
    },

    displayVisiblePlayers: function(context, visiblePlayers) {
        for (let i = 0; i < visiblePlayers.length; i++) {
            let p = visiblePlayers[i];
            Canvas.displayPlayer(context, p);
        }
    },

    initCanvas: function(canvas) {
        canvas = document.getElementById("canvas");
        canvas.width = Globals.SCREEN_WIDTH;
        canvas.height = Globals.SCREEN_HEIGHT;
        context = canvas.getContext("2d");
    }
};


