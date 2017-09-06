var IO = {
	init: function() {
		IO.socket = io.connect();
		IO.bindEvents();
    },

    bindEvents: function() {
        IO.socket.on('connection', function() {
            socketId = io.socket.sessionid;
        });

        IO.socket.on('joinGame', function(msg) {
            console.log('joining game');
            mainPlayer = msg.player;
            clearForm();
            Input.addEventListeners();
            Canvas.initCanvas();
            gameLoop(context);
        });

        IO.socket.on("updatePlayer", function(msg) {
            mainPlayer = msg.player;
        });

        IO.socket.on('updatePowerups', function(msg) {
            powerups = msg.powerups;
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
                    mainPlayer.x = oldX;
                    mainPlayer.y = oldY;
                }
                if (mainPlayer.x < 0 || mainPlayer.x > Globals.DEFAULT_MAP_WIDTH) {
                    mainPlayer.x = oldX;
                }
                if (mainPlayer.y < 0 || mainPlayer.y > Globals.DEFAULT_MAP_HEIGHT) {
                    mainPlayer.y = oldY;
                }
            }

            IO.socket.emit('updatePlayer', { player: mainPlayer });

        });

        IO.socket.on('announce', function(msg) {
            timeLastAnnounced = new Date().getTime();
            announceMessage = msg.message;
        });

    }

};


