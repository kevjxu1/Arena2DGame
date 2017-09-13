"use strict";

class ChatBox {

    init: function(socket, context) {
        this.socket = socket;
        this.context = context;    
        this.isChatting = false;
        this.message = "";

        // the most recent message is first in array
        this.pastMessages = [];

        this._getCurrentTime = function() {
            function padWithZero(ts) {
                if (ts < 10)
                    return '0' + ts;
            }
            let now = new Date();
            let hh = padWithZero(now.getHours());
            let mm = padWithZero(now.getMinutes());
            let ss = padWithZero(now.getSeconds());
            return now.getHours() + ':' + now.getMinutes;
        }
        
        document.addEventListener('keydown', function(e) {
            if (e.keyCode == Globals.KEY_ENTER) {
                if (!isChatting)
                    this.isChatting = true;
                else {
                    // submit message
                    socket.emit('submitChatMessage', 
                            { message: this.message,
                            timestamp: this._getCurrentTime() });
                    this.message = "";
                    this.isChatting = false;
                }
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.keyCode != Globals.KEY_ENTER && this.isChatting) {
                this.message += String.fromCharCode(e.keyCode);
            }
        });

        socket.on('receiveMessage', function(msg) {
            let message = msg.message;
            let timestamp = msg.timestamp;
            this.pastMessages.unshift(message);
        });
    }
}

