'use strict';

var Chat = {
    isChatting: false,
    message: "",

    // class ChatMessage
    ChatMessage: function(name, ts, text) {
        this.name = name;
        this.ts = ts;
        this.text = text;
    },

    // setup
    setup: function() {
        //// place the chat input on bottom left of canvas
        let chatBody = document.getElementById('chatBody');
        let chatInput = document.getElementById('chatInput');
        chatBody.style.bottom = -SCREEN_HEIGHT + 305 + 'px';
        
    },

    // TODO: break the line at some str length
    formatMessage: function(name, ts, text) {
        return  '[' + name + ' - ' + ts + ']' + ': ' + text
    },


    _getCurrentTime: function() {
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
    },

};
