// @author         Zaso
// @name           Left Sidebar Columns
// @category       Tweaks
// @version        0.0.2
// @description    Organizes the controller in the left sidebar in two columns.

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
