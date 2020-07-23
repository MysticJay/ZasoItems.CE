// @author         Zaso
// @name           Portal Hack Range
// @category       Layer
// @version        0.0.7
// @description    Add a circle around the portals to show the range where you can hack the portal.



// PLUGIN START ////////////////////////////////////////////////////////
// History
// 0.0.7 Headers changed. Ready for IITC-CE
// 0.0.6 Original sript


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
