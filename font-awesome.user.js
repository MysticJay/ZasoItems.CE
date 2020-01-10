// ==UserScript==
// @id             iitc-plugin-font-awesome@Zaso
// @name           IITC plugin: Font Awesome
// @category       Tweaks
// @version        0.0.3.20180217.123738
// @namespace      http://www.giacintogarcea.com/ingress/items/
// @updateURL      http://www.giacintogarcea.com/ingress/iitc/font-awesome-by-zaso.meta.js
// @downloadURL    http://www.giacintogarcea.com/ingress/iitc/font-awesome-by-zaso.user.js
// @description    Add Font Awesome Icons.
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