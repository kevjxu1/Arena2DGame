'use strict'; 
 
 var IO = {
	init: function() {
		IO.socket = io.connect();
		//IO.bindEvents();
	},

	//bindEvents: function() {
	//	IO.socket.on('connected', IO.onConnected);
	//},
	//
	//onConnected: function(data) {
    //    
	//}	
};

IO.init();
