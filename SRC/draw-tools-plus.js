// @author         Zaso
// @name           Draw tools plus
// @category       Layer
// @version        0.1.10
// @description    Edit and improve Draw tools.



// PLUGIN START ////////////////////////////////////////////////////////
// history
// 0.1.10 stripped all code for EDF, merge and MPE
// 0.1.9 Headers updated. Ready for IITC-CE
// 0.1.8 Original script
    /*
    // "color" is optional
    window.plugin.drawToolsPlus.drawPolyline(arrCoordArr, color);
    window.plugin.drawToolsPlus.drawPolygon(arrCoordArr, color);
    window.plugin.drawToolsPlus.drawCircle(coord, radius, color);
    window.plugin.drawToolsPlus.drawMarker(coord, color);
    */

	// use own namespace for plugin
	window.plugin.drawToolsPlus = {};

	// ---------------------------------------------------------------------------------
	// MODDING DRAW TOOLS
	// ---------------------------------------------------------------------------------
	window.plugin.drawToolsPlus.boot = function(){
		// REWRITE DRAW FUNCIONS
		// EXPAND DRAW TOOLS - MULTI STORAGE FOR PROJECTS
		window.plugin.drawToolsPlus.storageKEY = 'plugin-draw-tools-layer';
		window.addHook('iitcLoaded', function(){
			$('#toolbox a:contains(\'DrawTools Opt\')').addClass('list-group-item').prepend('<i class="fa fa-pencil"></i>');
		});
	};

	// FUNCTIONS TO DRAW
	window.plugin.drawToolsPlus.fireDraw = function(layer, layerType){
        map.fire('draw:created', {
            layer: layer,
            layerType: layerType
        });
    }

	window.plugin.drawToolsPlus.drawPolyline = function(arrCoordArr, color){
        if(color !== undefined){
            var oldColor = window.plugin.drawTools.currentColor;
            window.plugin.drawTools.setDrawColor(color);
        }
        var drawOpt = window.plugin.drawTools.lineOptions;

        var layer = L.geodesicPolyline(arrCoordArr, drawOpt);
        var layerType = 'polyline';
        window.plugin.drawToolsPlus.fireDraw(layer, layerType);

        if(color !== undefined){ window.plugin.drawTools.setDrawColor(oldColor); }

        return layer;
/*
        var drawOpt = window.plugin.drawTools.lineOptions;
        var arrCoordArr = [[42.447585,13.285419],[41.692902,13.418577]];
//        var layer = L.polyline(arrCoordArr, drawOpt);
        var layer = L.geodesicPolyline(arrCoordArr, drawOpt);
        var layerType = 'polyline';
        window.plugin.drawToolsPlus.fireDraw(layer, layerType);
*/
    }
	window.plugin.drawToolsPlus.drawPolygon = function(arrCoordArr, color){
        if(color !== undefined){
            var oldColor = window.plugin.drawTools.currentColor;
            window.plugin.drawTools.setDrawColor(color);
        }
        var drawOpt = window.plugin.drawTools.polygonOptions;

        var layer = L.geodesicPolygon(arrCoordArr, drawOpt);
        var layerType = 'polygon';
        window.plugin.drawToolsPlus.fireDraw(layer, layerType);

        if(color !== undefined){ window.plugin.drawTools.setDrawColor(oldColor); }

        return layer;
    }
	window.plugin.drawToolsPlus.drawCircle = function(coord, radius, color){
        if(color !== undefined){
            var oldColor = window.plugin.drawTools.currentColor;
            window.plugin.drawTools.setDrawColor(color);
        }
        var drawOpt = window.plugin.drawTools.polygonOptions;

        var layer = L.geodesicCircle(coord, radius, drawOpt);
        var layerType = 'circle';
        window.plugin.drawToolsPlus.fireDraw(layer, layerType);

        if(color !== undefined){ window.plugin.drawTools.setDrawColor(oldColor); }

        return layer;
    }
	window.plugin.drawToolsPlus.drawMarker = function(coord, color){
        if(color !== undefined){
            var oldColor = window.plugin.drawTools.currentColor;
            window.plugin.drawTools.setDrawColor(color);
        }
        var drawOpt = window.plugin.drawTools.markerOptions;

        var layer = L.marker(coord, drawOpt);
        var layerType = 'marker';
        window.plugin.drawToolsPlus.fireDraw(layer, layerType);

        if(color !== undefined){ window.plugin.drawTools.setDrawColor(oldColor); }

        return layer;
    }

	// *********************************************************************************

	window.plugin.drawToolsPlus.setupCSS = function(){
		$("<style>").prop("type", "text/css").html(''
            +'.leaflet-bar{box-shadow:0 1px 5px rgba(0,0,0,.65);}'
            +'.leaflet-draw .leaflet-draw-section .leaflet-bar{box-shadow:none;}'
            +'.leaflet-draw{box-shadow:0 1px 5px rgba(0,0,0,.65);border-radius:4px;}'

            +'.leaflet-draw .leaflet-draw-section .leaflet-bar.leaflet-draw-toolbar-top a:last-child{border-bottom:2px solid #999;}'
            +'.leaflet-draw .leaflet-draw-section .leaflet-bar a{border-radius:0;}'

            +'.leaflet-draw .leaflet-draw-section .leaflet-bar{border-radius:0 0 4px 4px;overflow:hidden;margin-top:0;}'
            +'.leaflet-draw .leaflet-draw-section .leaflet-bar.leaflet-draw-toolbar-top{border-radius:4px 4px 0 0;}'
		).appendTo("head");
	}

	var setup = function(){                             // If "draw tool plus" is loaded before "draw tools"
		if(window.plugin.drawTools){
            window.pluginCreateHook('pluginDrawTools'); 

			window.plugin.drawToolsPlus.boot();
			window.plugin.drawToolsPlus.setupCSS();
		}
	}
.
// PLUGIN END //////////////////////////////////////////////////////////