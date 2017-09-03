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
            console.log('startGame callback');

            // give player unique id
            mainPlayer = msg.player

            clearForm();
            Input.addEventListeners();
            Canvas.initCanvas();
            gameLoop(context);

        });

        IO.socket.on("updatePlayer", function(msg) {
            mainPlayer = msg.player;
            console.log('x: ' + mainPlayer.x);
        });

        IO.socket.on('playerDied', function() {
            //mainPlayer = null;
            IO.socket.off('updatePlayer');
            IO.socket.off('updateVisibleOthers');
            IO.socket.off('updateProjectiles');
            Input.removeEventListeners();
            mainPlayer = null;
            alert('You died');
        });

        IO.socket.on('updateVisibleOthers', function(msg) {
            visibleOthers = msg.visibleOthers;
        });

        IO.socket.on('updateProjectiles', function(msg) {
            projectiles = msg.projectiles;
        });

    },

};


