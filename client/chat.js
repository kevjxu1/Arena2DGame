'use strict';

var Chat = {
    isChatting: false,
    message: "",

    ChatMessage: function(name, ts, text) {
        this.name = name;
        this.ts = ts;
        this.text = text;
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
