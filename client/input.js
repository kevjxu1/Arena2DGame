'use strict';
// This module defines the event listeners for keyboard and mouse inputs

var Input = {
	addEventListeners: function() {
        document.addEventListener('mousemove', Input.onMousemove, false);
		document.addEventListener("keydown", Input.addDir, false);
        document.addEventListener('keyup', Input.rmDir, false);
        document.addEventListener('mousedown', Input.onMousedown, false);
        document.addEventListener('keydown', Input.onSpaceDown, false);
        document.addEventListener('keydown', Input.toggleChat, false);
    },

    removeEventListeners: function() {
        document.removeEventListener('keydown', Input.addDir);
        document.removeEventListener('mousedown', Input.onMousedown);
        document.removeEventListener('keyup', Input.rmDir);
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

	addDir: function(e) {
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

    rmDir: function(e) {
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

                //// temporary:
                ////$canvasDiv').hide();
                //$('body').on('contextmenu', '#canvasDiv', function(e) { 
                //    return true; 
                //});

                // turn on chatting
                console.log('chatting on');
                Chat.isChatting = true;

                // temorarily disable movement
                document.removeEventListener('keydown', Input.addDir);
                document.removeEventListener('keyup', Input.rmDir);

                // halt player movement by removing its directions
                mainPlayer.moveDir = dirs.DIR_NONE;
                IO.socket.emit('updatePlayerDir', { moveDir: dirs.DIR_NONE });

                // enable chat input
                $("#chatInput").prop('disabled', false);
                $('#chatInput').focus();
            }
            else {
                // submit message
                let ts = Chat._getCurrentTime();
                let textInput = $("#chatInput").val()
                if (textInput != '') {
                    IO.socket.emit('sendChatMessage', { 
                            name: mainPlayer.name,
                            ts: ts,
                            text: $("#chatInput").val() });
                }

                Chat.message = "";
                Chat.isChatting = false;

                // unhalt player
                document.addEventListener("keydown", Input.addDir, false);
                document.addEventListener('keyup', Input.rmDir, false);

                // clear and disable chat input
                $('#chatInput').val('');
                $("#chatInput").prop('disabled', true);
            }
        }
    },

    ////////////////////////////////////////////////////
};

