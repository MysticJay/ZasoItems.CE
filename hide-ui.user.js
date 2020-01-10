// ==UserScript==
// @id             iitc-plugin-hide-ui-zaso@Zaso
// @name           IITC plugin: Hide UI
// @category       Controls
// @version        0.1.4.20200110.212101
// @namespace      http://www.giacintogarcea.com/ingress/items/
// @updateURL      https://github.com/MysticJay/ZasoItems.CE/raw/master/hide-ui.meta.js
// @downloadURL    https://github.com/MysticJay/ZasoItems.CE/raw/master/hide-ui.user.js
// @description    Hide all UI for screenshot.
// @match          https://intel.ingress.com/*
// @grant          none
// ==/UserScript==

function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function(){};

// PLUGIN START ////////////////////////////////////////////////////////
// History
// 0.1.4 Headers changed. Ready for IITC-CE
// 0.1.3 Original sript


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

    setup.info = plugin_info; //add the script info data to the function as a property
    if(!window.bootPlugins) window.bootPlugins = [];
    window.bootPlugins.push(setup);
    // if IITC has already booted, immediately run the 'setup' function
    if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);

