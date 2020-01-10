// ==UserScript==
// @id             iitc-plugin-decay-calculator@Zaso
// @name           IITC plugin: Decay Calculator
// @category       Info
// @version        0.0.2.20180217.123738
// @namespace      http://www.giacintogarcea.com/ingress/items/
// @updateURL      http://www.giacintogarcea.com/ingress/iitc/decay-calculator-by-zaso.meta.js
// @downloadURL    http://www.giacintogarcea.com/ingress/iitc/decay-calculator-by-zaso.user.js
// @description    Estimate the portal decaying.
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
	window.plugin.decayCalculator = function() {};

	window.plugin.decayCalculator.generateArrayEnergy = function(data){
		var d = data.portalDetails;

		var l,v,max,perc,perc2;
		var list = [];

		for(var i=0;i<8;i++){
			var reso = d.resonators[i];
			if(reso){
				l = parseInt(reso.level);
				v = parseInt(reso.energy);
				max = RESO_NRG[l];
				perc = Math.round((v/max * 100));
				perc2 = v/max * 100;
			} else {
				l = 0;
				v = 0;
				max = 0;
				perc = 0;
				perc2 = 0;
			}

			list.push(perc);
		}
		return list.sort();
	}
	window.plugin.decayCalculator.generateArrayDays = function(risArray){
		list = [];

		for(i in risArray){
			var gg = window.plugin.decayCalculator.risDecay(risArray[i]);
			list.push(gg);
		}
		return list.sort();
	}

	window.plugin.decayCalculator.risMin = function(risArray){
		var min = 0;
		for(i in risArray){
			min = Math.min(min, risArray[i]);
		}
		return(min);
	}
	window.plugin.decayCalculator.risMax = function(risArray){
		var max = 0;
		for(i in risArray){
			max = Math.max(max, risArray[i]);
		}
		return(max);
	}

	window.plugin.decayCalculator.risDecay = function(ris){
		return Math.ceil(ris/15);
	}

	window.plugin.decayCalculator.portalNeut = function(risArray){
		var max = window.plugin.decayCalculator.risMax(risArray);
		var gg = window.plugin.decayCalculator.risDecay(max);

		return(gg);
	}
	window.plugin.decayCalculator.linkNeut = function(risArray){
		arrDays = window.plugin.decayCalculator.generateArrayDays(risArray);
		var gg = window.plugin.decayCalculator.risDecay(risArray[5]);
		return gg;
	}

	//---------------------------------------------------------------------------------------

	window.plugin.decayCalculator.appendDetails = function(data){
		window.plugin.decayCalculator.appendDetails2(data);
	}

	window.plugin.decayCalculator.appendDetails2 = function(data){
		risArray = window.plugin.decayCalculator.generateArrayEnergy(data);

		fd = window.plugin.decayCalculator.risDecay(risArray[0]);
		ld = window.plugin.decayCalculator.linkNeut(risArray);
		pd = window.plugin.decayCalculator.portalNeut(risArray);

		var html = '';
		html += '<div>Incomplete in<br/>max <b>'+fd+'</b> day(s)</div>';
		html += '<div>Links expires in<br/>max <b>'+ld+'</b> day(s)</div>';
		html += '<div>Neutral in<br/>max <b>'+pd+'</b> day(s)</div>';

		$('#portaldetails .linkdetails').before('<div class="decayCalculator">'+html+'</div>');
	}

	//---------------------------------------------------------------------------------------
	// Append the stylesheet
	//---------------------------------------------------------------------------------------
	window.plugin.decayCalculator.setupCSS = function(){
		$('<style>').prop('type', 'text/css').html(''
			+'.decayCalculator{text-align:center;padding:2px 0 3px;border:1px solid #20A8B1;border-width:1px 0;}'
			+'.decayCalculator div{display:inline-block;width:33%;color:lightgrey;}'
			+'.decayCalculator div b{color:#ffce00;}'
		).appendTo('head');
	}

	var setup = function() {
		window.plugin.decayCalculator.setupCSS();

		window.addHook('portalDetailsUpdated', window.plugin.decayCalculator.appendDetails);
	};

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