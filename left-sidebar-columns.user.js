// ==UserScript==
// @author         Zaso
// @name           IITC plugin: IITC plugin: Left Sidebar Columns
// @category       Tweaks
// @version        0.0.2.20240210.130254
// @description    Organizes the controller in the left sidebar in two columns.
// @id             left-sidebar-columns
// @namespace      https://github.com/IITC-CE/ingress-intel-total-conversion
// @updateURL      https://github.com/MysticJay/ZasoItems.CE/raw/master/left-sidebar-columns.user.js
// @downloadURL    https://github.com/MysticJay/ZasoItems.CE/raw/master/left-sidebar-columns.user.js
// @match          https://intel.ingress.com/*
// @match          https://intel-x.ingress.com/*
// @grant          none
// ==/UserScript==

function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
plugin_info.buildName = 'ZasoItems';
plugin_info.dateTimeVersion = '2024-02-10-130254';
plugin_info.pluginId = 'left-sidebar-columns';
//END PLUGIN AUTHORS NOTE

// PLUGIN START ////////////////////////////////////////////////////////

window.plugin.leftSidebarColumns = {};

window.plugin.leftSidebarColumns.columnsNumber = 2;

window.plugin.leftSidebarColumns.setupCSS = function(){
  $('<style>').prop('type', 'text/css').html(''
    +'#map .leaflet-control-container .leaflet-top.leaflet-left'
    +'{'
      +'max-height: 90%;'
      +'max-height: 90%;'
      +'max-height: 90%;'
      +'max-height: 90%;'

      +'height: -webkit-calc(100% - 126px);'
      +'height: -moz-calc(100% - 126px);'
      +'height: -o-calc(100% - 126px);'
      +'height: calc(100% - 126px);'

      +'        column-count: '+window.plugin.leftSidebarColumns.columnsNumber+';'
      +'   -moz-column-count: '+window.plugin.leftSidebarColumns.columnsNumber+';'
      +'-webkit-column-count: '+window.plugin.leftSidebarColumns.columnsNumber+';'

      +'        column-fill: auto;'
      +'   -moz-column-fill: auto;'
      +'-webkit-column-fill: auto;'

      +'        column-rule: none;'
      +'   -moz-column-rule: none;'
      +'-webkit-column-rule: none;'
    +'}'

    +'#map .leaflet-control-container .leaflet-top.leaflet-left .leaflet-control{'
      +'               break-inside: avoid;' /* IE 10+ */
      +'          page-break-inside: avoid;' /* Firefox */
      +'-webkit-column-break-inside: avoid;' /* Chrome, Safari, Opera */
    +'}'
  ).appendTo('head');
}

var setup = function(){
  window.plugin.leftSidebarColumns.setupCSS();
}

// PLUGIN END //////////////////////////////////////////////////////////

setup.info = plugin_info; //add the script info data to the function as a property
if (typeof changelog !== 'undefined') setup.info.changelog = changelog;
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

