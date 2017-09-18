"use strict";

function _getCurrentTime() {
    let now = new Date();
    function padWithZero(tt) {
        if (tt < 10)
            return '0' + tt;
        else
            return tt;
    }
    let hh = padWithZero(now.getHours());
    let mm = padWithZero(now.getMinutes());
    let ss = padWithZero(now.getSeconds());
    return hh + ':' + mm + ':' + ss;
}

class ChatMessage {
    constructor(ts, text) {
        this.ts = ts;
        this.text = text;
    }
};

//var ChatClient = function(socket, context) {
//    this.socket = socket;
//    console.log('chatClient socket: ' + socket);
//    this.context = context;    
//    this.isChatting = false;
//    this.message = "";
//
//    // the most recent message is first in array
//    this.pastMessages = [];
//}
//ChatClient.prototype.init = function() {
//    console.log('initializing chat client');
//    document.addEventListener('keydown', function(e) {
//        if (e.keyCode == Globals.KEY_ENTER) {
//            if (!this.isChatting) {
//                console.log('turn on chat mode');
//                this.isChatting = true;
//            }
//            else {
//                // submit message
//                chatMsg = new ChatMessage(_getCurrentTime(), this.message);
//                socket.emit('submitChatMessage', 
//                            { chatMsg: chatMsg });
//                console.log('submitting message: ' + chatMsg);
//                this.message = "";
//                this.isChatting = false;
//            }
//        }
//    });
//
//    document.addEventListener('keydown', function(e) {
//        if (e.keyCode != Globals.KEY_ENTER && this.isChatting) {
//            this.message += String.fromCharCode(e.keyCode);
//        }
//    });
//
//    this.socket.on('receiveMessage', function(msg) {
//        console.log('chat message: ' + msg.ts + '- ' + msg.text);
//        let chatMsg = new ChatMessage(msg.ts, msg.text);
//        //this.pastMessages.unshift(chatMsg);
//    });
//}
class ChatClient {
    constructor() {
        console.log('initializing chat client');
        this.socket = null;
        this.context = context;    
        this.isChatting = false;
        this.message = "";

        // the most recent message is first in array
        this.pastMessages = [];
    }

    init(socket) {
        this.socket = socket;
        console.log('pastMessages: ' + this.pastMessages);

        document.addEventListener('keydown', function(e) {
            if (e.keyCode == Globals.KEY_ENTER) {
                if (!this.isChatting) {
                    console.log('turn on chat mode');
                    this.isChatting = true;
                }
                else {
                    // submit message
                    let chatMsg = new ChatMessage(_getCurrentTime(), this.message);
                    console.log('submitting message: ' + chatMsg.ts + ' ' + chatMsg.text);
                    socket.emit('submitChatMessage', { chatMsg: chatMsg });
                    this.message = "";
                    this.isChatting = false;
                }
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.keyCode != Globals.KEY_ENTER && this.isChatting) {
                this.message.concat(String.fromCharCode(e.keyCode));
                //this.message += String.fromCharCode(e.keyCode);
            }
        });

        socket.on('receiveMessage', function(msg) {
            console.log('chat message: ' + msg.ts + '- ' + msg.text);
            let chatMsg = new ChatMessage(msg.ts, msg.text);
            this.pastMessages.unshift(chatMsg);
        });
 
    }

}

