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
        chatBody.style.position = 'relative';
        //chatBody.style.top = (SCREEN_HEIGHT - 400) + 'px';
        let chatInput = document.getElementById('chatInput');
        chatInput.style.width = '400px';
        chatBody.style.bottom = (SCREEN_HEIGHT - 20) + 'px';
        //chatBody.style.top = 0;
        
        chatInput.style.bottom = (SCREEN_HEIGHT - 20) + 'px';
        //chatInput.style.top = 0;
        console.log('bot: ' + chatBody.style.bottom);
        //console.log('top: ' + chatBody.style.top);
        //chatBody.style.bottom = (SCREEN_HEIGHT - 20) + 'px';
        
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
