// ==UserScript==
// @id             iitc-plugin-mpe-bookmarks@Zaso
// @name           IITC plugin: MPE for Bookmarks
// @category       Misc
// @version        0.0.2.20200110.212101
// @namespace      http://www.giacintogarcea.com/ingress/items/
// @updateURL      https://github.com/MysticJay/ZasoItems.CE/raw/master/mpe-bookmarks.meta.js
// @downloadURL    https://github.com/MysticJay/ZasoItems.CE/raw/master/mpe-bookmarks.user.js
// @description    Add multi-project (MPE) to "Bookmarks for Maps and Portals" plugin.
// @match          https://intel.ingress.com/*
// @grant          none
// ==/UserScript==

function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function(){};

// PLUGIN STARTs////////////////////////////////////////////////////////
// History
// 0.0.2 Headers changed. Ready for IITC-CE
// 0.0.1 Original sript


	// use own namespace for plugin
	window.plugin.mpeBkmrks = {};

	// ---------------------------------------------------------------------------------
	// MPE - BKMRKS
	// ---------------------------------------------------------------------------------
	window.plugin.mpeBkmrks.fixForPlugin = function(){
		if(!window.plugin.bookmarks){ return; }

		// FIX BOOKMARKS
		window.plugin.bookmarks.dialogLoadListFolders = function(idBox, clickAction, showOthersF, scanType/*0 = maps&portals; 1 = maps; 2 = portals*/) {
			var list = JSON.parse(localStorage[window.plugin.bookmarks.KEY_STORAGE]);
			var listHTML = '';
			var foldHTML = '';
			var elemGenericFolder = '';

			// For each type and folder
			for(var type in list){
				if(scanType === 0 || (scanType === 1 && type === 'maps') || (scanType === 2 && type === 'portals')){
					listHTML += '<h3>'+type+':</h3>';

					for(var idFolders in list[type]) {
						var label = list[type][idFolders]['label'];

						// Create a folder
						foldHTML = '<div class="bookmarkFolder" id="'+idFolders+'" data-type="'+type+'" data-id="'+idFolders+'" onclick="'+clickAction+'(this)";return false;">'+label+'</div>';

						if(idFolders !== window.plugin.bookmarks.KEY_OTHER_BKMRK) {
							listHTML += foldHTML;
						} else {
							if(showOthersF === true){
								elemGenericFolder = foldHTML;
							}
						}
					}
				}
				listHTML += elemGenericFolder;
				elemGenericFolder = '';
			}

			// Append all folders
			var r = '<div class="bookmarksDialog" id="'+idBox+'">'
				+ listHTML
				+ '</div>';

			return r;
		}
		window.plugin.bookmarks.dialogLoadList = function() {
			var r = 'The "<a href="http://iitc.jonatkins.com/?page=desktop#plugin-draw-tools" target="_BLANK"><strong>Draw Tools</strong></a>" plugin is required.</span>';

			if(!window.plugin.bookmarks || !window.plugin.drawTools) {
				$('.ui-dialog-autodrawer .ui-dialog-buttonset .ui-button:not(:first)').hide();
			}
			else{
				var portalsList = JSON.parse(localStorage[window.plugin.bookmarks.KEY_STORAGE]);
				var element = '';
				var elementTemp = '';
				var elemGenericFolder = '';

				// For each folder
				var list = portalsList.portals;
				for(var idFolders in list) {
					var folders = list[idFolders];

					// Create a label and a anchor for the sortable
					var folderLabel = '<a class="folderLabel" onclick="$(this).siblings(\'div\').toggle();return false;">'+folders['label']+'</a>';

					// Create a folder
					elementTemp = '<div class="bookmarkFolder" id="'+idFolders+'">'+folderLabel+'<div>';

					// For each bookmark
					var fold = folders['bkmrk'];
					for(var idBkmrk in fold) {
						var bkmrk = fold[idBkmrk];
						var label = bkmrk['label'];
						var latlng = bkmrk['latlng'];

						// Create the bookmark
						elementTemp += '<a class="bkmrk" id="'+idBkmrk+'" onclick="$(this).toggleClass(\'selected\');return false" data-latlng="['+latlng+']">'+label+'</a>';
					}
					elementTemp += '</div></div>';

					if(idFolders !== window.plugin.bookmarks.KEY_OTHER_BKMRK) {
						element += elementTemp;
					} else {
						elemGenericFolder += elementTemp;
					}
				}
				element += elemGenericFolder;

				// Append all folders and bookmarks
				r = '<div id="bkmrksAutoDrawer">'
					+ '<label style="margin-bottom: 9px; display: block;">'
					+ '<input style="vertical-align: middle;" type="checkbox" id="bkmrkClearSelection" checked>'
					+ ' Clear selection after drawing</label>'
					+ '<p style="margin-bottom:9px;color:red">You must select 2 or 3 portals!</p>'
					+ '<div onclick="window.plugin.bookmarks.autoDrawOnSelect();return false;">'
					+ element
					+ '</div>'
					+ '</div>';
			}
			return r;
		}
	}

	window.plugin.mpeBkmrks.initMPE = function(){
		if(!window.plugin.bookmarks){ return; }

		window.plugin.mpe.setMultiProjects({
			namespace: 'bookmarks2',
			title: 'Bookmarks for Maps and Portals',
			fa: 'fa-bookmark',
			defaultKey: 'plugin-bookmarks',
			func_setKey: function(newKey){
				window.plugin.bookmarks.KEY_STORAGE = newKey;
				window.plugin.bookmarks.KEY.key = newKey;
			},
			func_pre: function(){},
			func_post: function(){
				// Delete all Markers
//				window.plugin.bookmarks.resetAllStars();
				for(guid in window.plugin.bookmarks.starLayers){
					var starInLayer = window.plugin.bookmarks.starLayers[guid];
					window.plugin.bookmarks.starLayerGroup.removeLayer(starInLayer);
					delete window.plugin.bookmarks.starLayers[guid];
				}

				// Create Storage if not exist
				window.plugin.bookmarks.createStorage();
				// Load Storage
				window.plugin.bookmarks.loadStorage();
//				window.plugin.bookmarks.saveStorage();

				// Delete and Regenerate Bookmark Lists
				window.plugin.bookmarks.refreshBkmrks();

				// Add Markers
				window.plugin.bookmarks.addAllStars();

				// Refresh Highlight
				window.plugin.bookmarks.highlightRefresh();

				window.runHooks('pluginBkmrksEdit', {"target": "all", "action": "import"});
			}
		});
	}

	// *********************************************************************************

	var setup = function(){
		if(window.plugin.mpe !== undefined){
			window.plugin.mpeBkmrks.fixForPlugin();
			window.plugin.mpeBkmrks.initMPE();
		}
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

