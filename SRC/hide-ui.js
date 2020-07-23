// @author         Zaso
// @name           Hide UI Zaso
// @category       Controls
// @version        0.1.4
// @description    Hide all UI for screenshot.

// PLUGIN START ////////////////////////////////////////////////////////
// History
// 0.1.5 avoid default event for [ALT-h] (@mvolfik)
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
        e.preventDefault();
      }
    }, false);
  }

  var setup = function(){
    window.plugin.hideUIzaso.setupCSS();
    window.plugin.hideUIzaso.addShortcut();
  }

