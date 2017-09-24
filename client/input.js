'use strict';

var Input = {
	addEventListeners: function() {
        document.addEventListener('mousemove', Input.onMousemove, false);
		document.addEventListener("keydown", Input.onKeydown, false);
        document.addEventListener('keyup', Input.onKeyup, false);
        document.addEventListener('mousedown', Input.onMousedown, false);
        document.addEventListener('keydown', Input.onSpaceDown, false);
    },

    removeEventListeners: function() {
        document.removeEventListener('keydown', Input.onKeydown);
        document.removeEventListener('mousedown', Input.onMousedown);
        document.removeEventListener('keyup', Input.onKeyup);
        document.removeEventListener('keydown', Input.onSpaceDown);
        document.removeEventListener('mousemove', Input.onMousemove);
    },

    onMousemove: function(e) {
        let rect = canvasBack.getBoundingClientRect();
        let cursorX = e.clientX - rect.left;
        let cursorY = e.clientY - rect.top;
        let xdiff = cursorX - Globals.SCREEN_WIDTH / 2;
        let ydiff = cursorY - Globals.SCREEN_HEIGHT / 2;
        mainPlayer.angle = atan2(xdiff, ydiff);
    },

	onKeydown: function(e) {
        switch (e.keyCode) {
        case Globals.KEY_W:
        case Globals.KEY_UP:
            mainPlayer.moveDir |= Globals.DIR_UP;
            IO.socket.emit('updatePlayerDir', { moveDir: mainPlayer.moveDir });
            break;
        case Globals.KEY_A:
        case Globals.KEY_LEFT:
            mainPlayer.moveDir |= Globals.DIR_LEFT;
            IO.socket.emit('updatePlayerDir', { moveDir: mainPlayer.moveDir });
            break;
        case Globals.KEY_D:
        case Globals.KEY_RIGHT:
            mainPlayer.moveDir |= Globals.DIR_RIGHT;
            IO.socket.emit('updatePlayerDir', { moveDir: mainPlayer.moveDir });
            break;
        case Globals.KEY_S:
        case Globals.KEY_DOWN:
            mainPlayer.moveDir |= Globals.DIR_DOWN;
            IO.socket.emit('updatePlayerDir', { moveDir: mainPlayer.moveDir });
            break;
        default:
            break;
        }
	},

    onKeyup: function(e) {
        // halt movement
        let dir = Globals.DIR_NONE;

        switch (e.keyCode) {
        case Globals.KEY_W:
        case Globals.KEY_UP:
            dir |= Globals.DIR_UP;
            break;
        case Globals.KEY_A:
        case Globals.KEY_LEFT:
            dir |= Globals.DIR_LEFT;
            break;
        case Globals.KEY_D:
        case Globals.KEY_RIGHT:
            dir |= Globals.DIR_RIGHT;
            break;
        case Globals.KEY_S:
        case Globals.KEY_DOWN:
            dir |= Globals.DIR_DOWN;
            break;
        default:
            break;
        }
        mainPlayer.moveDir &= (~dir & 0xF);
        IO.socket.emit('updatePlayerDir', { moveDir: mainPlayer.moveDir });
    },

    onMousedown: function(e) {
        if (e.which == 1) {  // left mouse button => shoot a projectile
            if (new Date().getTime() - timeLastFired < mainPlayer.reloadTime) {
                // mainPlayer has not reloaded yet
                return;
            }
            timeLastFired = new Date().getTime();
            let proj = new Projectile(
                    mainPlayer.x, mainPlayer.y,
                    Globals.DEFAULT_PROJECTILE_RADIUS,
                    Globals.DEFAULT_PROJECTILE_SPEED,
                    Globals.DEFAULT_PROJECTILE_RANGE,
                    mainPlayer.angle,
                    mainPlayer.id, mainPlayer.color);

            IO.socket.emit('addProjectile', { 
                    x: mainPlayer.x, y: mainPlayer.y, 
                    dir: mainPlayer.angle,
                    playerId: mainPlayer.id,
                    color: mainPlayer.color });
        }
        //else if (e.which == 2) {}  // middle mouse button
        //else if (e.which == 3) {  // right mouse button
        //    switch(mainPlayer.powerup) {
        //    case Globals.POWER_CANNON:
        //        let proj = new Projectile(
        //            mainPlayer.x, mainPlayer.y,
        //            100, 4, 900,
        //            mainPlayer.angle,
        //            mainPlayer.id, mainPlayer.color);
        //        IO.socket.emit('addProjectile', { proj: proj });
        //        //proj.angle = proj.angle * 180 / Math.PI;
        //        mainPlayer.powerup = Globals.POWER_NONE;
        //        break;
        //    default:  // Globals.POWER_NONE
        //        break;
        //    }       
        //}  // end right mouse button
        else
            return;
    },

};

