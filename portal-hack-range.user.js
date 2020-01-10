// ==UserScript==
// @id             iitc-plugin-hack-range@Zaso
// @name           IITC plugin: Portal Hack Range
// @category       Layer
// @version        0.0.6.20180217.123738
// @namespace      http://www.giacintogarcea.com/ingress/items/
// @updateURL      http://www.giacintogarcea.com/ingress/iitc/portal-hack-range-by-zaso.meta.js
// @downloadURL    http://www.giacintogarcea.com/ingress/iitc/portal-hack-range-by-zaso.user.js
// @description    Add a circle around the portals to show the range where you can hack the portal.
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
	window.plugin.hackrange = function() {};
	window.plugin.hackrange.hackLayers = {};
	window.plugin.hackrange.MIN_MAP_ZOOM = 17;

	window.plugin.hackrange.removeCircle = function(guid){
		var previousLayer = window.plugin.hackrange.hackLayers[guid];
		if(previousLayer){
			window.plugin.hackrange.hackCircleHolderGroup.removeLayer(previousLayer);
			delete window.plugin.hackrange.hackLayers[guid];
		}
	}
	window.plugin.hackrange.addCircle = function(guid){
		var d = window.portals[guid];
		var coo = d._latlng;
		var latlng = new L.LatLng(coo.lat,coo.lng);
		var optCircle = {color:window.ACCESS_INDICATOR_COLOR,opacity:1,fillColor:window.ACCESS_INDICATOR_COLOR,fillOpacity:0.2,weight:1,clickable:false, dashArray: [10,10]};
		var range = window.HACK_RANGE;

		var circle = new L.Circle(latlng, range, optCircle);
		circle.addTo(window.plugin.hackrange.hackCircleHolderGroup);
		window.plugin.hackrange.hackLayers[guid] = circle;
	}

	window.plugin.hackrange.portalAdded = function(data){
		data.portal.on('add', function(){
			window.plugin.hackrange.addCircle(this.options.guid);
		});

		data.portal.on('remove', function(){
			window.plugin.hackrange.removeCircle(this.options.guid);
		});
	}

	// *****************************************************************

	var setup =  function() {
		// this layer is added to the layer chooser, to be toggled on/off
		window.plugin.hackrange.rangeLayerGroup = new L.LayerGroup();
		// this layer is added into the above layer, and removed from it when we zoom out too far
		window.plugin.hackrange.hackCircleHolderGroup = new L.LayerGroup();

		window.plugin.hackrange.rangeLayerGroup.addLayer(window.plugin.hackrange.hackCircleHolderGroup);

		window.addLayerGroup('Hack Portal Ranges', window.plugin.hackrange.rangeLayerGroup, true);

		window.addHook('portalAdded', window.plugin.hackrange.portalAdded);
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