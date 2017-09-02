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
            canvas.addEventListener('mousemove', function(e) {
                var rect = canvas.getBoundingClientRect();
                let x = e.clientX - rect.left;
                let y = e.clientY - rect.top;
                console.log('(x,y): (' + x + ',' + y);
            });

            gameLoop(context);

        });

        IO.socket.on("updatePlayer", function(msg) {
            if (!playerAlive) {
                return;
            }
            console.log('updatePlayer callback');
            mainPlayer = msg.player;
        });

        IO.socket.on('playerDied', function() {
            //mainPlayer = null;
            playerAlive = false;
            alert('You died');
        });

        IO.socket.on('updateVisibleOthers', function(msg) {
            if (!playerAlive)
                return;
            visibleOthers = msg.visibleOthers;
        });

        IO.socket.on('updateProjectiles', function(msg) {
            projectiles = msg.projectiles;
        });

    }

};


