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
            killPlayer();
            announceMessage = 'You died!';
            timeLastAnnounced = new Date().getTime();
        });

        IO.socket.on('addVisibleOther', function(msg) {
            let player = msg.player;
            console.log('add visible other: ' + player.id);
            visibleOthers[player.id] = player;
        });

        IO.socket.on('rmVisibleOther', function(msg) {
            console.log('removing visible other: ' + id);
            if (visibleOthers[msg.id]) {
                delete visibleOthers[msg.id];
            }
        });

        IO.socket.on('updateProjectilePos', function(msg) {
            let id = msg.id;
            let x = msg.x;
            let y = msg.y;
            projectiles[id].x = x;
            projectiles[id].y = y;
        });

        IO.socket.on('addProjectile', function(msg) {
            let proj = msg.proj;
            projectiles[proj.id] = proj;
            console.log('addProjectile');
            console.log('projectiles: ');
            console.log(projectiles);
        });
        
        IO.socket.on('rmProjectile', function(msg) {
            let id = msg.id;
            if (projectiles[id]) {
                delete projectiles[id];
            }
            console.log('rmProjectile');
            console.log('projectiles: ');
            console.log(projectiles);
        });
 
    }
};


