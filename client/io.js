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

        IO.socket.on('updatePlayerPos', function(msg) {
            console.log('x: ' + msg.x + ' y: ' + msg.y);
            mainPlayer.x = msg.x;
            mainPlayer.y = msg.y;
        });

        IO.socket.on('updatePlayerPowerup', function(msg) {
            mainPlayer.powerup = msg.powerup;
            switch(mainPlayer.powerup) {
            case Globals.POWER_CANNON:
                var powerupString = 'Cannon';
                break;
            default:
                powerupString = 'None';
                break;
            }
            announceMessage = 'You picked up powerup: ' + powerupString;
            timeLastAnnounced = new Date().getTime();
        });

        IO.socket.on('updatePlayerHp', function(msg) {
            mainPlayer.hp = msg.hp;
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
        
        //IO.socket.on('announce', function(msg) {
        //    timeLastAnnounced = new Date().getTime();
        //    announceMessage = msg.message;
        //});
    }
};


