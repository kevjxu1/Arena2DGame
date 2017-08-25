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

        IO.socket.on('startGame', function() {
            console.log('startGame callback');
            clearForm();
            Input.addEventListeners();
            Canvas.initCanvas(canvas);
            gameLoop(context);

        });

        IO.socket.on("updatePlayer", function(msg) {
            Player.player = msg.player;
        });

        IO.socket.on('updateVisiblePlayers', function(msg) {
            visiblePlayers = msg.visiblePlayers;
        });
    },

    updatePlayer: function(player) {
        Player.player = player;
    }

};


