// @author         Zaso
// @name           Draw tools plus
// @category       Layer
// @version        0.1.10
// @description    Edit and improve Draw tools.



// PLUGIN START ////////////////////////////////////////////////////////
// history
// 0.1.9 Headers updated. Ready for IITC-CE
// 0.1.8 Original script
    /*
    // "color" is optional
    window.plugin.drawToolsPlus.drawPolyline(arrCoordArr, color);
    window.plugin.drawToolsPlus.drawPolygon(arrCoordArr, color);
    window.plugin.drawToolsPlus.drawCircle(coord, radius, color);
    window.plugin.drawToolsPlus.drawMarker(coord, color);

    window.plugin.drawToolsPlus.merge(dataStringImported);
    window.plugin.drawToolsPlus.paste(dataStringImported);
    */

	// use own namespace for plugin
	window.plugin.drawToolsPlus = {};

	// ---------------------------------------------------------------------------------
	// MODDING DRAW TOOLS
	// ---------------------------------------------------------------------------------
	window.plugin.drawToolsPlus.boot = function(){
		// REWRITE DRAW FUNCIONS
		window.plugin.drawTools.manualOpt = function(){
			var html = '<div class="drawtoolsStyles">'
					+ '<input type="color" name="drawColor" id="drawtools_color"></input>'
					//TODO: add line style choosers: thickness, maybe dash styles?
					+ '</div>'
					+ '<div class="drawtoolsSetbox">'
					+ '<a onclick="window.plugin.drawTools.optCopy();" tabindex="0">Copy Drawn Items</a>'
					+ '<a onclick="window.plugin.drawToolsPlus.optPaste();return false;" tabindex="0">Paste Drawn Items</a>'
					+ '<a onclick="window.plugin.drawToolsPlus.optMerge();return false;" tabindex="0">Merge Drawn Items</a>'
					+ (window.requestFile != undefined
					? '<a onclick="window.plugin.drawTools.optImport();return false;" tabindex="0">Import Drawn Items</a>' : '')
					+ ((typeof android !== 'undefined' && android && android.saveFile)
					? '<a onclick="window.plugin.drawTools.optExport();return false;" tabindex="0">Export Drawn Items</a>' : '')
					+ '<a onclick="window.plugin.drawTools.optReset();return false;" tabindex="0">Reset Drawn Items</a>'
					+ '<a onclick="window.plugin.drawTools.snapToPortals();return false;" tabindex="0">Snap to portals</a>'
				+ '</div>';

			dialog({
				html: html,
				id: 'plugin-drawtools-options',
				dialogClass: 'ui-dialog-drawtoolsSet',
				title: 'Draw Tools Options'
			});

			// need to initialise the 'spectrum' colour picker
			$('#drawtools_color').spectrum({
				flat: false,
				showInput: false,
				showButtons: false,
				showPalette: true,
				showSelectionPalette: false,
				palette: [ ['#a24ac3','#514ac3','#4aa8c3','#51c34a'],
						['#c1c34a','#c38a4a','#c34a4a','#c34a6f'],
						['#000000','#666666','#bbbbbb','#ffffff']
				],
				change: function(color){ window.plugin.drawTools.setDrawColor(color.toHexString()); },
		//		move: function(color){ window.plugin.drawTools.setDrawColor(color.toHexString()); },
				color: window.plugin.drawTools.currentColor,
			});
			runHooks('pluginDrawTools',{event: 'openOpt'});
		}

		window.plugin.drawTools.load = function(){
			try{
				var dataStr = localStorage[window.plugin.drawToolsPlus.storageKEY];
				if(dataStr === undefined) return;

				var data = JSON.parse(dataStr);
				window.plugin.drawTools.import(data);
			}catch(e){
				console.warn('draw-tools: failed to load data from localStorage: '+e);
			}
		}

		window.plugin.drawTools.optCopy = function(){
			if(window.localStorage[window.plugin.drawToolsPlus.storageKEY] === '' || window.localStorage[window.plugin.drawToolsPlus.storageKEY] === undefined){
				dialog({
					html: 'Error! The storage is empty or not exist. Before you try copy/export you draw something.',
					width: 250,
					dialogClass: 'ui-dialog-drawtools-message',
					title: 'Draw Tools Message'
				});
				return;
			}

			if(typeof android !== 'undefined' && android && android.shareString){
				android.shareString(window.localStorage[window.plugin.drawToolsPlus.storageKEY]);
			}else{
				var stockWarnings ={};
				var stockLinks = [];

				window.plugin.drawTools.drawnItems.eachLayer(function(layer){
					if(layer instanceof L.GeodesicCircle || layer instanceof L.Circle){
						stockWarnings.noCircle = true;
						return; //.eachLayer 'continue'
					}else if(layer instanceof L.GeodesicPolygon || layer instanceof L.Polygon){
						stockWarnings.polyAsLine = true;
					// but we can export them
					}else if(layer instanceof L.GeodesicPolyline || layer instanceof L.Polyline){
						// polylines are fine
					}else if(layer instanceof L.Marker){
						stockWarnings.noMarker = true;
						return; //.eachLayer 'continue'
					}else{
						stockWarnings.unknown = true; //should never happen
						return; //.eachLayer 'continue'
					}
					// only polygons and polylines make it through to here
					var latLngs = layer.getLatLngs();
					// stock only handles one line segment at a time
					for(var i=0; i<latLngs.length-1; i++){
						stockLinks.push([latLngs[i].lat,latLngs[i].lng,latLngs[i+1].lat,latLngs[i+1].lng]);
					}
					// for polygons, we also need a final link from last to first point
					if(layer instanceof L.GeodesicPolygon || layer instanceof L.Polygon){
						stockLinks.push([latLngs[latLngs.length-1].lat,latLngs[latLngs.length-1].lng,latLngs[0].lat,latLngs[0].lng]);
					}
				});

				var stockUrl = 'https://intel.ingress.com/intel?ll='+map.getCenter().lat+','+map.getCenter().lng+'&z='+map.getZoom()+'&pls='+stockLinks.map(function(link){return link.join(',');}).join('_');
				var stockWarnTexts = [];
				if(stockWarnings.polyAsLine) stockWarnTexts.push('Note: polygons are exported as lines');
				if(stockLinks.length>40) stockWarnTexts.push('Warning: Stock intel may not work with more than 40 line segments - there are '+stockLinks.length);
				if(stockWarnings.noCircle) stockWarnTexts.push('Warning: Circles cannot be exported to stock intel');
				if(stockWarnings.noMarker) stockWarnTexts.push('Warning: Markers cannot be exported to stock intel');
				if(stockWarnings.unknown) stockWarnTexts.push('Warning: UNKNOWN ITEM TYPE');

				// Export Normal draw
				var html = ''
					+'<p style="margin:0 0 6px;">Normal export:</p>'
					+'<p style="margin:0 0 6px;"><a onclick="$(this).parent().next(\'textarea\').select();">Select all</a> and press CTRL+C to copy it.</p>'
					+'<textarea readonly onclick="event.target.select();" style="height:70px;">'+window.localStorage[window.plugin.drawToolsPlus.storageKEY]+'</textarea>';

				// Export draw (polygons as lines)
				html += '<hr/>'
					+'<p style="margin:0 0 6px;">or export with polygons as lines (not filled):</p>'
					+'<p style="margin:0 0 6px;"><a onclick="$(this).parent().next(\'textarea\').select();">Select all</a> and press CTRL+C to copy it.</p>'
					+'<textarea readonly onclick="event.target.select();" style="height:70px;">'+window.plugin.drawToolsPlus.getDrawAsLines()+'</textarea>';

				// Export for intel stock URL (only lines)
				html += '<hr/>'
					+'<p style="margin:0 0 6px;">or export as a link for the standard intel map (for non IITC users):</p>'
					+'<p style="margin:0 0 6px;"><a onclick="$(this).parent().next(\'input\').select();">Select all</a> and press CTRL+C to copy it.</p>'
					+'<input onclick="event.target.select();" type="text" size="49" value="'+stockUrl+'"/>';

				if(stockWarnTexts.length>0){
					html += '<ul><li>'+stockWarnTexts.join('</li><li>')+'</li></ul>';
				}

				dialog({
					html: html,
					width: 350,
					dialogClass: 'ui-dialog-drawtoolsSet-copy',
					title: 'Draw Tools Export'
				});
			}
		}

        window.plugin.drawTools.optPaste = window.plugin.drawToolsPlus.optPaste;
        window.plugin.drawTools.paste = window.plugin.drawToolsPlus.paste;

		window.plugin.drawTools.optExport = function(){
			if(window.localStorage[window.plugin.drawToolsPlus.storageKEY] === '' || window.localStorage[window.plugin.drawToolsPlus.storageKEY] === undefined){
				dialog({
					html: 'Error! The storage is empty or not exist. Before you try copy/export you draw something.',
					width: 250,
					dialogClass: 'ui-dialog-drawtools-message',
					title: 'Draw Tools Message'
				});
				return;
			}
			if(typeof android !== 'undefined' && android && android.saveFile){
				android.saveFile('IITC-drawn-items.json', 'application/json', window.localStorage[window.plugin.drawToolsPlus.storageKEY]);
			}
		}

		window.plugin.drawTools.optReset = function(){
			var promptAction = confirm('All drawn items will be deleted. Are you sure?', '');
			if(promptAction){
//				delete localStorage[window.plugin.drawToolsPlus.storageKEY];
				localStorage[window.plugin.drawToolsPlus.storageKEY] = '[]';
				window.plugin.drawTools.drawnItems.clearLayers();
				window.plugin.drawTools.load();
				console.log('DRAWTOOLS: reset all drawn items');
				window.plugin.drawTools.optAlert('Reset Successful. ');
				runHooks('pluginDrawTools',{event: 'clear'});
			}
		}

		// EXPAND DRAW TOOLS - MULTI STORAGE FOR PROJECTS
		window.plugin.drawToolsPlus.storageKEY = 'plugin-draw-tools-layer';
		window.plugin.drawTools.save = function(){
			var data = [];

			window.plugin.drawTools.drawnItems.eachLayer(function(layer){
				var item = {};
				if(layer instanceof L.GeodesicCircle || layer instanceof L.Circle){
					item.type = 'circle';
					item.latLng = layer.getLatLng();
					item.radius = layer.getRadius();
					item.color = layer.options.color;
				}else if(layer instanceof L.GeodesicPolygon || layer instanceof L.Polygon){
					item.type = 'polygon';
					item.latLngs = layer.getLatLngs();
					item.color = layer.options.color;
				}else if(layer instanceof L.GeodesicPolyline || layer instanceof L.Polyline){
					item.type = 'polyline';
					item.latLngs = layer.getLatLngs();
					item.color = layer.options.color;
				}else if(layer instanceof L.Marker){
					item.type = 'marker';
					item.latLng = layer.getLatLng();
					item.color = layer.options.icon.options.color;
				}else{
					console.warn('Unknown layer type when saving draw tools layer');
					return; //.eachLayer 'continue'
				}

				data.push(item);
			});

			localStorage[window.plugin.drawToolsPlus.storageKEY] = JSON.stringify(data);
			console.log('draw-tools: saved to localStorage');
		}

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

	// IMPORT (MERGE)
	window.plugin.drawToolsPlus.merge = function(dataStringImported){
		try{
            // first see if it looks like a URL-format stock intel link, and if so, try and parse out any stock drawn items
            // from the pls parameter
            if(dataStringImported.match(new RegExp("^(https?://)?(intel\\.)ingress\\.com/intel.*[?&]pls="))){
                //looks like a ingress URL that has drawn items...
                var items = dataStringImported.split(/[?&]/);
                var foundAt = -1;
                for(var i=0; i<items.length; i++){
                    if(items[i].substr(0,4) == "pls="){
                        foundAt = i;
                    }
                }

                if(foundAt == -1) throw("No drawn items found in intel URL");

                var newLines = [];
                var linesStr = items[foundAt].substr(4).split('_');
                for(var i=0; i<linesStr.length; i++){
                    var floats = linesStr[i].split(',').map(Number);
                    if(floats.length != 4) throw("URL item not a set of four floats");
                    for(var j=0; j<floats.length; j++){
                        if(isNaN(floats[j])) throw("URL item had invalid number");
                    }
                    var layer = L.geodesicPolyline([[floats[0],floats[1]],[floats[2],floats[3]]], window.plugin.drawTools.lineOptions);
                    newLines.push(layer);
                }

                // all parsed OK - clear and insert
                window.plugin.drawTools.drawnItems.clearLayers();
                for(var i=0; i<newLines.length; i++){
                    window.plugin.drawTools.drawnItems.addLayer(newLines[i]);
                }
                window.runHooks('pluginDrawTools',{event: 'import'});

                console.log('DRAWTOOLS: merge drawn items from stock URL');
                window.plugin.drawTools.optAlert('Merge Successful.');
            }else{
                dataStringImported = (typeof(
                    window.localStorage[window.plugin.drawToolsPlus.storageKEY]) !== 'undefined' &&
                    window.localStorage[window.plugin.drawToolsPlus.storageKEY].length > 4
                        ? window.localStorage[window.plugin.drawToolsPlus.storageKEY].slice(0,-1) + ',' + dataStringImported.slice(1) : dataStringImported);
                var data = JSON.parse(dataStringImported);

                window.plugin.drawTools.drawnItems.clearLayers();
                window.plugin.drawTools.import(data);
                console.log('DRAWTOOLS: merge drawn items');
                window.plugin.drawTools.optAlert('Merge Successful.');
            }

            // to write back the data to localStorage
            window.plugin.drawTools.save();
		}catch(e){
            console.warn('DRAWTOOLS: failed to merge data: '+e);
            window.plugin.drawTools.optAlert('<span style="color: #f88">Merge Failed</span>');
		}
    }
	window.plugin.drawToolsPlus.optMerge = function (){
		var promptAction = prompt('Press CTRL+V to paste items to merge (draw-tools data or stock intel URL).', '');
		if(promptAction !== null && promptAction !== ''){
            window.plugin.drawToolsPlus.merge(promptAction);
		}
	}

	// IMPORT (NOT MERGE)
    window.plugin.drawToolsPlus.paste = function(dataStringImported){
        try{
            // first see if it looks like a URL-format stock intel link, and if so, try and parse out any stock drawn items
            // from the pls parameter
            if (dataStringImported.match(new RegExp("^(https?://)?(intel\\.)ingress\\.com/intel.*[?&]pls="))) {
                //looks like a ingress URL that has drawn items...
                var items = dataStringImported.split(/[?&]/);
                var foundAt = -1;
                for (var i=0; i<items.length; i++) {
                    if (items[i].substr(0,4) == "pls=") {
                        foundAt = i;
                    }
                }

                if (foundAt == -1) throw ("No drawn items found in intel URL");

                var newLines = [];
                var linesStr = items[foundAt].substr(4).split('_');
                for (var i=0; i<linesStr.length; i++) {
                    var floats = linesStr[i].split(',').map(Number);
                    if (floats.length != 4) throw("URL item not a set of four floats");
                    for (var j=0; j<floats.length; j++) {
                    if (isNaN(floats[j])) throw("URL item had invalid number");
                  }
                    var layer = L.geodesicPolyline([[floats[0],floats[1]],[floats[2],floats[3]]], window.plugin.drawTools.lineOptions);
                    newLines.push(layer);
                }

                // all parsed OK - clear and insert
                window.plugin.drawTools.drawnItems.clearLayers();
                for (var i=0; i<newLines.length; i++) {
                    window.plugin.drawTools.drawnItems.addLayer(newLines[i]);
                }
                runHooks('pluginDrawTools', {event: 'import'});

                console.log('DRAWTOOLS: reset and imported drawn items from stock URL');
                window.plugin.drawTools.optAlert('Import Successful.');
            }else{
                var data = JSON.parse(dataStringImported);
                window.plugin.drawTools.drawnItems.clearLayers();
                window.plugin.drawTools.import(data);
                console.log('DRAWTOOLS: reset and imported drawn items');
                window.plugin.drawTools.optAlert('Import Successful.');
            }
            // to write back the data to localStorage
            window.plugin.drawTools.save();
        } catch(e) {
            console.warn('DRAWTOOLS: failed to import data: '+e);
            window.plugin.drawTools.optAlert('<span style="color: #f88">Import failed</span>');
        }
    }
    window.plugin.drawToolsPlus.optPaste = function(){
        var promptAction = prompt('Press CTRL+V to paste (draw-tools data or stock intel URL).', '');
        if(promptAction !== null && promptAction !== ''){
            window.plugin.drawToolsPlus.paste(promptAction);
        }
    }

	// ---------------------------------------------------------------------------------
	// EXPORT (POLYS AS LINES)
	// ---------------------------------------------------------------------------------
	window.plugin.drawToolsPlus.getDrawAsLines = function(){
		var rawDraw = JSON.parse(window.localStorage[window.plugin.drawToolsPlus.storageKEY]);
		var draw = [];

		for(i in rawDraw){
			var elemDraw = rawDraw[i];

			if(elemDraw.type === 'polygon'){
				var convElemDraw = {};
				convElemDraw.color = elemDraw.color;
				convElemDraw.type = 'polyline';
				convElemDraw.latLngs = [];

				var v = elemDraw.latLngs.length;
				for(j in elemDraw.latLngs){
					var ll = elemDraw.latLngs[j];
					convElemDraw.latLngs.push(ll);
				}
				convElemDraw.latLngs.push(elemDraw.latLngs[0]);

				draw.push(convElemDraw);
			}else{
				draw.push(elemDraw);
			}
		}

		return JSON.stringify(draw);
	}

	// ---------------------------------------------------------------------------------
	// EMPTY POLYGONS (EMPTY DRAWN FIELDS)
	// ---------------------------------------------------------------------------------
	window.plugin.drawToolsPlus.edf = {};
	window.plugin.drawToolsPlus.edf.storage = {};
	window.plugin.drawToolsPlus.edf.draw = {};
	window.plugin.drawToolsPlus.edf.obj = {};
	window.plugin.drawToolsPlus.edf.action = {};
	window.plugin.drawToolsPlus.edf.ui = {};

	window.plugin.drawToolsPlus.edf.boot = function(){
		window.addHook('pluginDrawTools', window.plugin.drawToolsPlus.edf.hookManagement);

		window.plugin.drawToolsPlus.edf.ui.setupCSS();

		window.plugin.drawToolsPlus.edf.storage.check();
		window.plugin.drawToolsPlus.edf.storage.restore();

		window.addHook('iitcLoaded', function(){
			if(window.plugin.drawToolsPlus.edf.obj.status){
				window.plugin.drawToolsPlus.edf.draw.toggleOpacityOpt();
				window.plugin.drawToolsPlus.edf.draw.clearAndDraw();
			}
		});
	};

	window.plugin.drawToolsPlus.edf.obj.status = false;
	window.plugin.drawToolsPlus.edf.obj.toggle = function(){
		var status = window.plugin.drawToolsPlus.edf.obj.status;
		status = Boolean(!status);
		window.plugin.drawToolsPlus.edf.obj.status = status;
	}

	window.plugin.drawToolsPlus.edf.storage.NAME = 'plugin-draw-tools-edf';
	window.plugin.drawToolsPlus.edf.storage.save = function(){
		window.localStorage[window.plugin.drawToolsPlus.edf.storage.NAME] = JSON.stringify(window.plugin.drawToolsPlus.edf.obj.status);
	}
	window.plugin.drawToolsPlus.edf.storage.restore = function(){
		window.plugin.drawToolsPlus.edf.obj.status = JSON.parse(window.localStorage[window.plugin.drawToolsPlus.edf.storage.NAME]);
	}
	window.plugin.drawToolsPlus.edf.storage.check = function(){
		if(!window.localStorage[window.plugin.drawToolsPlus.edf.storage.NAME]){
			window.plugin.drawToolsPlus.edf.storage.save();
		}
	}

	window.plugin.drawToolsPlus.edf.draw.toggleOpacityOpt = function(){
		if(window.plugin.drawToolsPlus.edf.obj.status){
			window.plugin.drawTools.polygonOptions.fillOpacity = 0.0;
		}else{
			window.plugin.drawTools.polygonOptions.fillOpacity = 0.2;
		}
	}
	window.plugin.drawToolsPlus.edf.draw.clearAndDraw = function(){
		window.plugin.drawTools.drawnItems.clearLayers();
		window.plugin.drawTools.load();
		console.log('DRAWTOOLS: reset all drawn items');
	}

	window.plugin.drawToolsPlus.edf.action.toggle = function(){
		window.plugin.drawToolsPlus.edf.obj.toggle();
		window.plugin.drawToolsPlus.edf.draw.toggleOpacityOpt();
		window.plugin.drawToolsPlus.edf.storage.save();
		window.plugin.drawToolsPlus.edf.draw.clearAndDraw();
	}

	window.plugin.drawToolsPlus.edf.hookManagement = function(data){
		if(data.event === 'openOpt'){
			window.plugin.drawToolsPlus.edf.ui.appendBtnToBox();
		}else if(data.event == 'layerCreated'){
			if(window.plugin.drawToolsPlus.edf.obj.status){
//				window.plugin.drawToolsPlus.edf.draw.toggleOpacityOpt();
				window.plugin.drawToolsPlus.edf.draw.clearAndDraw();
			}
		}
	}

	window.plugin.drawToolsPlus.edf.ui.appendBtnToBox = function(){
		var statusCheck = '';
		if(window.plugin.drawToolsPlus.edf.obj.status){
			statusCheck = 'checked';
		}

		$('#dialog-plugin-drawtools-options .drawtoolsSetbox').append(
			'<label id="edfToggle"><input type="checkbox" '+statusCheck+' name="edf" onchange="window.plugin.drawToolsPlus.edf.action.toggle();return false;" />Not fill the polygon(s)<label>'
		);
	}
	window.plugin.drawToolsPlus.edf.ui.setupCSS = function(){
		$("<style>").prop("type", "text/css").html(''
			+'#edfToggle{cursor:pointer;display:block;margin-bottom:10px;text-align:center;margin-top:-4px;color:#ffce00;}'
			+'#edfToggle input{position:relative;top:2px;}'
		).appendTo("head");
	}

	// ---------------------------------------------------------------------------------
	// MPE - MULTI PROJECTS EXTENSION
	// ---------------------------------------------------------------------------------
	window.plugin.drawToolsPlus.mpe = {};
	window.plugin.drawToolsPlus.mpe.ui = {};

	window.plugin.drawToolsPlus.mpe.boot = function(){
		window.plugin.drawToolsPlus.mpe.initMPE();
	};

	window.plugin.drawToolsPlus.mpe.initMPE = function(){
		if(window.plugin.mpe !== undefined){
			window.plugin.mpe.setMultiProjects({
				namespace: 'drawToolsPlus',
				title: 'Draw Tools Layer',
				fa: 'fa-pencil',
				defaultKey: 'plugin-draw-tools-layer',
				func_setKey: function(newKey){
					window.plugin.drawToolsPlus.storageKEY = newKey;
				},
				func_pre: function(){},
				func_post: function(){
					window.plugin.drawTools.drawnItems.clearLayers();
					window.plugin.drawTools.load();
					console.log('DRAWTOOLS: reset all drawn items');

                    if(window.plugin.crossLinks !== undefined){
                        if(window.overlayStatus['Cross Links'] === true){
                            window.plugin.crossLinks.checkAllLinks();

                            if(window.plugin.destroyedLinks !== undefined){
                                if(window.overlayStatus['Destroyed Links Simulator'] === true){
//                                    window.plugin.destroyedLinks.cross.restoreCrossAll();
                                    window.plugin.destroyedLinks.cross.removeCrossAll();
                                }
                            }
                        }
                    }

                }
			});
		}
	}
	window.plugin.drawToolsPlus.mpe.setupCSS = function(){
		$("<style>").prop("type", "text/css").html(''
		).appendTo("head");
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

	var setup = function(){
		if(window.plugin.drawTools){
            window.pluginCreateHook('pluginDrawTools'); // If "draw tool plus" is loaded before "draw tools"

			window.plugin.drawToolsPlus.boot();
			window.plugin.drawToolsPlus.setupCSS();

			window.plugin.drawToolsPlus.edf.boot();
			
			if (!window.plugin.drawtools.initMPE) {     // if new Drawtools with MPE are already loaded
			  window.plugin.drawToolsPlus.mpe.boot();   // skip initialization of MPE.
		    }
		}
	}

// PLUGIN END //////////////////////////////////////////////////////////