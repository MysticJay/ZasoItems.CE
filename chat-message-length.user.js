// ==UserScript==
// @id             iitc-plugin-chat-message-length@Zaso
// @name           IITC plugin: Chat Message Length
// @category       Tweaks
// @version        0.1.2.20180217.123738
// @namespace      http://www.giacintogarcea.com/ingress/items/
// @updateURL      http://www.giacintogarcea.com/ingress/iitc/chat-message-length-by-zaso.meta.js
// @downloadURL    http://www.giacintogarcea.com/ingress/iitc/chat-message-length-by-zaso.user.js
// @description    Counts the chat message characters.
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @include        https://*.ingress.com/mission/*
// @include        http://*.ingress.com/mission/*
// @match          https://*.ingress.com/mission/*
// @match          http://*.ingress.com/mission/*
// @grant          none
// ==/UserScript==

function wrapper(){
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function(){};

// PLUGIN START ////////////////////////////////////////////////////////

	// use own namespace for plugin
	window.plugin.chatMsgLen = function(){};
	window.plugin.chatMsgLen.maxChar = 256;
	window.plugin.chatMsgLen.chatLen = 0;

	window.plugin.chatMsgLen.getChatLen = function(){
		return window.plugin.chatMsgLen.chatLen;
	}
	window.plugin.chatMsgLen.saveChatLen = function(){
		window.plugin.chatMsgLen.chatLen = $('#chattext').val().length;
	}

	window.plugin.chatMsgLen.checkLimit = function(){
		var l = window.plugin.chatMsgLen.getChatLen();
		var m = window.plugin.chatMsgLen.maxChar;
		if(l > m){
			$('#chattext-count').addClass('red');
			return 0;
		}else{
			$('#chattext-count').removeClass('red');
			return 1;
		}
	}

	window.plugin.chatMsgLen.updateCount = function(){
		window.plugin.chatMsgLen.saveChatLen();
		var l = window.plugin.chatMsgLen.getChatLen();
		var m = window.plugin.chatMsgLen.maxChar;
		$('#chattext-count').text(m-l);
		window.plugin.chatMsgLen.checkLimit();
	}

	window.plugin.chatMsgLen.setupCSS = function(){
		$("<style>").prop("type", "text/css").html(''
//			+'#chatinput #chattext{width:94%;}'
			+'#chatinput.chatMsgLen td.chatMsgLen{display:flex;flex-direction:row;}'
			+'#chatinput.chatMsgLen #chattext{flex:1;}'
			+'#chatinput.chatMsgLen #chattext-count{color:#aaa;display:inline;padding:0 3px 0 7px;margin:0;line-height:23px;}'
			+'#chatinput.chatMsgLen #chattext-count.red{color:#f66;}'
		).appendTo("head");
	};

	window.plugin.chatMsgLen.appendCounter = function(){
        $('#chatinput').addClass('chatMsgLen');
        $('#chattext').parent('td').addClass('chatMsgLen');

        if($('#chattext-count').length < 1){
            window.plugin.chatMsgLen.appendContent = '<p id="chattext-count" class="chatMsgLen"></p>';
            $('#chattext').after(window.plugin.chatMsgLen.appendContent);
        }
    }

	window.plugin.chatMsgLen.initBind = function(){
		$('#chattext').bind('input propertychange', function(){
			window.plugin.chatMsgLen.updateCount();
		});
		//Used 'focus' to update the counter when a player nickname is clicked
		$('#chattext').bind('focus', function(){
			window.plugin.chatMsgLen.updateCount();
		});
    }

	var setup =  function(){
		window.plugin.chatMsgLen.setupCSS();
        window.plugin.chatMsgLen.appendCounter();
        window.plugin.chatMsgLen.initBind();
		window.plugin.chatMsgLen.updateCount();
	}

// PLUGIN END //////////////////////////////////////////////////////////

if(window.iitcLoaded && typeof setup === 'function'){
	setup();
}else{
	if(window.bootPlugins)
		window.bootPlugins.push(setup);
	else
		window.bootPlugins = [setup];
}
} // wrapper end
// inject code into site context
var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ wrapper +')();'));
(document.body || document.head || document.documentElement).appendChild(script);