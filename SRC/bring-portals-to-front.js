// @author         Zaso
// @name           Bring Portals To Front
// @category       Tweaks
// @version        0.0.2
// @description    Bring the portals layers to front. Prevents that fields and drawn items cover them, making them unclickable.

// PLUGIN START ////////////////////////////////////////////////////////
// history
// 0.0.2 headers changed, ready for IITC-CE
// 0.0.1 Original Script

  // use own namespace for plugin
  window.plugin.bringPortalsToFront = function(){};

    window.plugin.bringPortalsToFront.bringTop = function(){
        window.Render.prototype.bringPortalsToFront();
    }

    window.plugin.bringPortalsToFront.drawToolsHook = function(data){
        if(data.event === 'layerCreated' || data.event === 'import'){
            window.plugin.bringPortalsToFront.bringTop();
        }
    }

//*****************************

  var setup = function(){
    window.map.on('overlayadd', function(e){
      if(e.name === 'Fields' || e.name === 'Drawn Items'){
                window.plugin.bringPortalsToFront.bringTop();
      }
    });

        window.pluginCreateHook('pluginDrawTools');
        window.addHook('pluginDrawTools', window.plugin.bringPortalsToFront.drawToolsHook);
  };

// PLUGIN END //////////////////////////////////////////////////////////
