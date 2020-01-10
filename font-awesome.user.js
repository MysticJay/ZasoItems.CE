// ==UserScript==
// @id             iitc-plugin-font-awesome@Zaso
// @name           IITC plugin: Font Awesome
// @category       Tweaks
// @version        0.0.4.20200110.190101
// @namespace      http://www.giacintogarcea.com/ingress/items/
// @updateURL      https://github.com/MysticJay/ZasoItems.CE/raw/master/font-awesome.meta.js
// @downloadURL    https://github.com/MysticJay/ZasoItems.CE/raw/master/font-awesome.user.js
// @description    Add Font Awesome Icons.
// @match          https://intel.ingress.com/*
// @grant          none
// ==/UserScript==

function wrapper(){
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function(){};

// PLUGIN START ////////////////////////////////////////////////////////
// history
// 0.0.4 Headers fixed. Ready for IITC-CE
// 0.0.3 Original script
	window.plugin.faIcon = {};

	var setup = function(){
		$('<link>')
			.prop('type', 'text/css')
			.prop('rel', 'stylesheet')
			.prop('href', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css')
			.appendTo('head');


		$("<style>").prop("type", "text/css").html(''
			+'#toolbox a .fa{ margin-right:4px; }'
		).appendTo("head");

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
