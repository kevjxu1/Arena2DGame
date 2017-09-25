'use strict';
// This module defines the event listeners for keyboard and mouse inputs

var Input = {
	addEventListeners: function() {
        document.addEventListener('mousemove', Input.onMousemove, false);
		document.addEventListener("keydown", Input.onKeydown, false);
        document.addEventListener('keyup', Input.onKeyup, false);
        document.addEventListener('mousedown', Input.onMousedown, false);
        document.addEventListener('keydown', Input.onSpaceDown, false);
        document.addEventListeners('keydown', Input.toggleChat, false);
        document.addEventListeners('keydown', Input.addToChatMessage, false);
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
        let xdiff = cursorX - SCREEN_WIDTH / 2;
        let ydiff = cursorY - SCREEN_HEIGHT / 2;
        mainPlayer.angle = atan2(xdiff, ydiff);
    },

	onKeydown: function(e) {
        switch (e.keyCode) {
        case KEY_W:
        case KEY_UP:
            mainPlayer.moveDir |= dirs.DIR_UP;
            IO.socket.emit('updatePlayerDir', { moveDir: mainPlayer.moveDir });
            break;
        case KEY_A:
        case KEY_LEFT:
            mainPlayer.moveDir |= dirs.DIR_LEFT;
            IO.socket.emit('updatePlayerDir', { moveDir: mainPlayer.moveDir });
            break;
        case KEY_D:
        case KEY_RIGHT:
            mainPlayer.moveDir |= dirs.DIR_RIGHT;
            IO.socket.emit('updatePlayerDir', { moveDir: mainPlayer.moveDir });
            break;
        case KEY_S:
        case KEY_DOWN:
            mainPlayer.moveDir |= dirs.DIR_DOWN;
            IO.socket.emit('updatePlayerDir', { moveDir: mainPlayer.moveDir });
            break;
        default:
            break;
        }
	},

    onKeyup: function(e) {
        let dir = dirs.DIR_NONE;

        switch (e.keyCode) {
        case KEY_W:
        case KEY_UP:
            dir |= dirs.DIR_UP;
            break;
        case KEY_A:
        case KEY_LEFT:
            dir |= dirs.DIR_LEFT;
            break;
        case KEY_D:
        case KEY_RIGHT:
            dir |= dirs.DIR_RIGHT;
            break;
        case KEY_S:
        case KEY_DOWN:
            dir |= dirs.DIR_DOWN;
            break;
        default:
            break;
        }
        // dir is the direction unpressed

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

            IO.socket.emit('addProjectile', { 
                    x: mainPlayer.x, y: mainPlayer.y, 
                    dir: mainPlayer.angle,
                    playerId: mainPlayer.id,
                    color: mainPlayer.color });
        }
        //else if (e.which == 2) {}  // middle mouse button
        //else if (e.which == 3) {  // right mouse button
        //    switch(mainPlayer.powerup) {
        //    case POWER_CANNON:
        //        let proj = new Projectile(
        //            mainPlayer.x, mainPlayer.y,
        //            100, 4, 900,
        //            mainPlayer.angle,
        //            mainPlayer.id, mainPlayer.color);
        //        IO.socket.emit('addProjectile', { proj: proj });
        //        //proj.angle = proj.angle * 180 / Math.PI;
        //        mainPlayer.powerup = POWER_NONE;
        //        break;
        //    default:  // POWER_NONE
        //        break;
        //    }       
        //}  // end right mouse button
        else
            return;
    },

    ////////////////////////////////////////////////////
    // Chat Log
    ////////////////////////////////////////////////////
    toggleChat: function(e) {
        if (e.keyCode == KEY_ENTER) {
            if (!Chat.isChatting) {
                console.log('chatting on');
                Chat.isChatting = true;
            }
            else {
                // submit message
                let ts = Chat._getCurrentTime();
                socket.emit('sendChatMessage', { 
                        name: mainPlayer.name,
                        ts: ts,
                        text: Chat.message });

                this.message = "";
                this.isChatting = false;
            }
        }
    },

    addToChatMessage: function(e) {
        if (!Chat.isChatting || e.keyCode == KEY_ENTER) {
            return;
        }
        
        // assuming ascii encoding
        if (e.keyCode < 32 || e.keyCode > 126) {
            // invalid keypress
            return;
        }

        // add typed character to chat message
        Chat.message.concat(String.fromCharCode(e.keyCode));
    }

    ////////////////////////////////////////////////////
};

