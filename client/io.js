var IO = {
	init: function() {
		IO.socket = io.connect();
		IO.bindEvents();
	},

    bindEvents: function() {
        IO.socket.on('connection', function() {
            //socketId = IO.socket.socket.sessionid;
            socketId = io.socket.sessionid;
        });

        IO.socket.on('startGame', function(msg) {
            // give player unique id
            Player.player = msg.player

            clearForm();
            Input.addEventListeners();
            Canvas.initCanvas(canvas);
            gameLoop(context);

        });

        IO.socket.on("updatePlayer", function(msg) {
            Player.player = msg.player;
        });

        IO.socket.on('updateVisibleOthers', function(msg) {
            visibleOthers = msg.visibleOthers;
        });
    }

};


