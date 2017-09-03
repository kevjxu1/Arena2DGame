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
            mainPlayer = msg.player;

            clearForm();
            Input.addEventListeners();
            Canvas.initCanvas();
            gameLoop(context);

        });

        IO.socket.on("updatePlayer", function(msg) {
            mainPlayer = msg.player;
        });

        IO.socket.on('killPlayer', function() {
            if (mainPlayer) {
                killPlayer();
            }
        });

        IO.socket.on('updateVisibleOthers', function(msg) {
            visibleOthers = msg.visibleOthers;
        });

        IO.socket.on('updateProjectiles', function(msg) {
            projectiles = msg.projectiles;
        });

        IO.socket.on('movePlayer', function(msg) {
            //mainPlayer = msg.player;

            if (mainPlayer) {
                var dir = mainPlayer.moveDir;
                var oldX = mainPlayer.x;
                var oldY = mainPlayer.y;
                var x = mainPlayer.x;
                var y = mainPlayer.y;
            }
            let isDiag = ((dir & Globals.DIR_UP) && (dir & Globals.DIR_LEFT))
                    || ((dir & Globals.DIR_UP) && (dir & Globals.DIR_RIGHT))
                    || ((dir & Globals.DIR_DOWN) && (dir & Globals.DIR_LEFT))
                    || ((dir & Globals.DIR_DOWN) && (dir & Globals.DIR_RIGHT));
            let l1speed = isDiag ? 
                    mainPlayer.speed / Math.sqrt(2) : mainPlayer.speed;

            if (dir & Globals.DIR_UP) {
                y -= l1speed;
            }
            else if (dir & Globals.DIR_DOWN) {
                y += l1speed;
            }

            if (dir & Globals.DIR_LEFT) {
                x -= l1speed;
            }
            else if (dir & Globals.DIR_RIGHT) {
                x += l1speed;
            }
            //else  // dir == Globals.NONE
            if (mainPlayer) {
                mainPlayer.x = x;
                mainPlayer.y = y;
                if (checkCollisions(mainPlayer, visibleOthers))  {
                    console.log('collision detected');
                    mainPlayer.x = oldX;
                    mainPlayer.y = oldY;
                }
            }

            IO.socket.emit('updatePlayer', { player: mainPlayer });
        });

    }

};


