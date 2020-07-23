// @author         Zaso
// @name           Chat Message Length
// @category       Tweaks
// @version        0.1.3
// @description    Counts the chat message characters.

// PLUGIN START ////////////////////////////////////////////////////////
// History
// 0.1.3 Headers changed. Ready for IITC-CE
// 0.1.2 Original sript


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
