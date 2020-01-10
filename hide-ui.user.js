// ==UserScript==
// @id             iitc-plugin-hide-ui-zaso@Zaso
// @name           IITC plugin: Hide UI
// @category       Controls
// @version        0.1.3.20180217.123738
// @namespace      http://www.giacintogarcea.com/ingress/items/
// @updateURL      http://www.giacintogarcea.com/ingress/iitc/hide-ui-by-zaso.meta.js
// @downloadURL    http://www.giacintogarcea.com/ingress/iitc/hide-ui-by-zaso.user.js
// @description    Hide all UI for screenshot.
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

	// Don't use "hide UI" to avoid being overwritten by plugins with the same name
	window.plugin.hideUIzaso = {};

	window.plugin.hideUIzaso.setupCSS = function(){
		$('<style>').prop('type', 'text/css').html(''
			+'body.hideAllUI > *, '
			+'body.hideAllUI .leaflet-control{display:none !important;}'
			+'body.hideAllUI #map{display:block !important;}'
		).appendTo('head');
	}

	window.plugin.hideUIzaso.toggle = function(){
		$('body').toggleClass('hideAllUI');
		if($('body').hasClass('hideAllUI')){
			map.closePopup();
		}
	}

	window.plugin.hideUIzaso.addShortcut = function(){
		document.addEventListener('keydown', function(e){
			// pressed alt+h
			if(e.keyCode === 72 && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey){
				window.plugin.hideUIzaso.toggle();
			}
		}, false);
	}

	var setup = function(){
		window.plugin.hideUIzaso.setupCSS();
		window.plugin.hideUIzaso.addShortcut();
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