// ==UserScript==
// @id             iitc-plugin-free-sidebar@Zaso
// @name           IITC plugin: Free Sidebar
// @category       Controls
// @version        0.0.3.20180217.123738
// @namespace      http://www.giacintogarcea.com/ingress/items/
// @updateURL      http://www.giacintogarcea.com/ingress/iitc/free-sidebar-by-zaso.meta.js
// @downloadURL    http://www.giacintogarcea.com/ingress/iitc/free-sidebar-by-zaso.user.js
// @description    Reduces use of sidebar.
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

	window.plugin.freeSidebar = {};

	window.plugin.freeSidebar.createControlToolbox = function(){
		L.Control.FreeToolbox = L.Control.extend({
			options: {
				collapsed: true,
				position: 'topright',
				autoZIndex: true
			},

			initialize: function(options){
				L.setOptions(this, options);
				this._lastZIndex = 0;
				this._handlingClick = false;
			},

			onAdd: function(){
				this._initLayout();
				this._update();
				return this._container;
			},

			onRemove: function(){},

			_initLayout: function(){
				var className = 'leaflet-control-toolbox',

					container = this._container = L.DomUtil.create('div', className);

				//Makes this work on IE10 Touch devices by stopping it from firing a mouseout event when the touch is released
				container.setAttribute('aria-haspopup', true);

				if(!L.Browser.touch){
					L.DomEvent
						.disableClickPropagation(container)
						.disableScrollPropagation(container);
				} else{
					L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
				}

				var divContainer = this._divContainer = L.DomUtil.create('div', className + '-list list-group');

				if(this.options.collapsed){
					if(!L.Browser.android){
						L.DomEvent
							.on(container, 'mouseover', this._expand, this)
							.on(container, 'mouseout', this._collapse, this);
					}
					var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
					link.href = '#';
					link.title = 'Toolbox';

					if(L.Browser.touch){
						L.DomEvent
							.on(link, 'click', L.DomEvent.stop)
							.on(link, 'click', this._expand, this);
					}
					else{
						L.DomEvent.on(link, 'focus', this._expand, this);
					}
					//Work around for Firefox android issue https://github.com/Leaflet/Leaflet/issues/2033
					L.DomEvent.on(divContainer, 'click', function(){
						setTimeout(L.bind(this._onInputClick, this), 0);
					}, this);

					this._map.on('click', this._collapse, this);
					// TODO keyboard accessibility
				} else{
					this._expand();
				}

				container.appendChild(divContainer);
			},

			_update: function(){},

			_onInputClick: function(){
				var input,
					inputs = this._divContainer.getElementsByTagName('input'),
					inputsLen = inputs.length;

				this._handlingClick = true;

				this._handlingClick = false;

				this._refocusOnMap();
			},

			_expand: function(){
				L.DomUtil.addClass(this._container, 'leaflet-control-toolbox-expanded');
			},

			_collapse: function(){
				this._container.className = this._container.className.replace(' leaflet-control-toolbox-expanded', '');
			}
		});

		L.control.freeToolbox = function(options){
			return new L.Control.FreeToolbox(options);
		};
	}
	window.plugin.freeSidebar.appendToolbox = function(){
		var t = $('#toolbox').detach();
		t.appendTo('.leaflet-control-toolbox .leaflet-control-toolbox-list');
	}
	window.plugin.freeSidebar.initToolbox = function(){
		window.plugin.freeSidebar.createControlToolbox();
		map.addControl(new L.control.freeToolbox());
		window.plugin.freeSidebar.appendToolbox();
	}

	window.plugin.freeSidebar.removeRedeemFromSidebar = function(){
		$('#redeem').remove();
	};
	window.plugin.freeSidebar.appendRedeemToToolbox = function(){
		$('#toolbox').append('<a class="list-group-item" onclick="window.plugin.freeSidebar.openRedeemDialog();return false;" title="Redeem code"><i class="fa fa-gift"></i>Redeem</a>');
	}
	window.plugin.freeSidebar.openRedeemDialog = function(){
		var html = '<input style="width:99%;" id="redeem" placeholder="Redeem code…" type="text"/>';
		dialog({
			html: html,
			dialogClass: 'ui-dialog-redeem-input',
			title: 'Redeem Passcode',
		});
		window.setupRedeem();
	}
	window.plugin.freeSidebar.initRedeem = function(){
		window.plugin.freeSidebar.removeRedeemFromSidebar();
		window.plugin.freeSidebar.appendRedeemToToolbox();
	}

	window.plugin.freeSidebar.setupCSS = function(){
		var baseIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAQAAAADQ4RFAAABu0lEQVR4AZ3SA6xdQRCH8a1t24qKqLatsGFt23Yb26m/2lZU27Ztd7qZ3dw3dfvyRRe//Ockx0kySi4iVIyzPOQoE8iF+03ZGUwri1LRB9FOU5yfQQ4PriI8NkjrzgdlO0n1AxiowMergGwrEa2B+a4Ql5BEuwNaQjVcbAeijTGoAmJqGNAdHlBZf56CxKYYVDwcHQ93Ae1BeMhkFiKJphnUms9IrD4R9UB+6hipI2nAU4QX3PGtxhFRevyW6Rb7ERaSGUc9XiAcpQxZfKmTkCM3S8wJS3Cs4DKZPHmOcISCuJBBWiX6MY45XEcYRUZfbV05TH5LDDIV5DiXSEENXTlKDtxvkSkfueKzHCQ3pUnxN9SC9ri4coRsVOEj8/+MmvKWj0zhCcIBclGEnGxFmP0TMuQ1EttLbqrxhiGkYDOWWUQrQ77SBUcJDiMMwLHJMINa8RYxfaAxjjwcQOhv1gxqbYl2nDI4ZfsR+sS1uUmo3k/kGIVwobjWJ7GWQpF+aTthXxtlhxB64FiH0DGgJz8cVtgSLS8HdW0YwryAzhpyyhz2/ZpnWoOAOvGIJ9p+iuJ+Uy5msYx2ePENpe3V+rEe44UAAAAASUVORK5CYII=';

		$('<style>').prop('type', 'text/css').html(''
			+'.leaflet-right{right:15px;}'

			+'.leaflet-control-toolbox{box-shadow:0 1px 5px rgba(0,0,0,0.4);background:#fff;border-radius:5px;}'
			+'.leaflet-control-toolbox-toggle{background-image:url('+baseIcon+');width:36px;height:36px;background-position:50% 50%;background-repeat:no-repeat;display:block;}'
			+'.leaflet-control-toolbox .leaflet-control-toolbox-list, .leaflet-control-toolbox-expanded .leaflet-control-toolbox-toggle{display:none;}'
			+'.leaflet-control-toolbox-expanded{padding:6px 10px 6px 6px;color:#333;background:#fff;}'
			+'.leaflet-control-toolbox-expanded .leaflet-control-toolbox-list{display:block;position:relative;}'

			+'.leaflet-control-toolbox #toolbox{border:0;}'
			+'.leaflet-control-toolbox #toolbox a{display:block !important;}'

			+'.leaflet-control-toolbox #toolbox .fa{color:#000;}'

//			+'#portaldetails{min-height:150px;}'
		).appendTo('head');
	}

	// *****************************************************************

	var setup = function(){
		if(!window.isSmartphone()){
			window.plugin.freeSidebar.setupCSS();

			window.plugin.freeSidebar.initToolbox();
			window.plugin.freeSidebar.initRedeem();
		}
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