/******************************************************************************
Name:    JZTool
Author:  Zennaro Julien

Licence:
JZTool is licensed under a Creative Commons Attribution-NonCommercial 2.5
License (http://creativecommons.org/licenses/by-nc/2.5/).

You are free:
	* to copy, distribute, display, and perform the work
	* to make derivative works

Under the following conditions:
	* Attribution. You must attribute the work in the manner  specified by  the
	  author or licensor.
	* Noncommercial. You may not use this work for commercial purposes.

* For  any  reuse  or  distribution, you  must make clear to others the license
  terms of this work.
* Any  of  these  conditions  can  be  waived  if  you  get permission from the 
  copyright holder.

Your fair use and other rights are in no way affected by the above.
******************************************************************************/
var jz = {

	$ : function (id_el, tag)
	{
		return (typeof tag == "undefined") ? document.getElementById(id_el) : 
		(typeof id_el == "object") ? id_el.getElementsByTagName(tag) :
		document.getElementById(id_el).getElementsByTagName(tag);
	},
	
	addev : function (el, ev, fn)
	{
		return el.addevListener ? el.addevListener(ev, fn, false) :
		el.attachEvent ? el.attachEvent('on' + ev, fn) : el['on' + ev] = fn;
	},
	
	delev : function (el, ev, fn)
	{
		(document.removeEventListener) ? el.removeEventListener(ev, fn, false) :
		(document.detachEvent) ? el.detachEvent('on'+ ev, fn) : el[ev] = null;
	},
	
	stopev : function (ev)
	{
		if(ev && ev.stopPropagation && ev.preventDefault)
		{
			ev.stopPropagation();	//1] arrêter la propagation de l'événement dans l'arbre DOM
			ev.preventDefault();	//2] annuler l'action implicite de l'évenement (href, submit, ...)
		}
		else if(ev && window.event) //IE
		{
			window.event.cancelBubble = true; //1]
			window.event.returnValue = false; //2]
		}
		return false;
	},
	
	getstyle : function (el, propr)
	{
		if(el.currentStyle) //IE
		{
			while(/\-(\S)/.exec(propr)) //border-left-width => borderLeftWidth
			{
				propr = propr.replace(/\-\S/, RegExp["$1"].toUpperCase());
			}
			return el.currentStyle[propr];
		}
		else if(window.getComputedStyle) //Gecko
		{
			return window.getComputedStyle(el, null).getPropertyValue(propr);
		}
	},

	ev_target : function (ev) {return ev.target || ev.srcElement;},
	
	ale : function (lim1, lim2) // (de .. à ) fait pour des petits nombres (< 5000)
	{
		do{alx = Math.round(Math.random()*lim2)}
		while (alx < lim1)
		return alx;
	},
	
	extend : function (target, ob) //target & ob sont des objets complexes donc passés par référence
	{
		for(var el in ob)
		{
			target[el] = ob[el];
		}
		return target;
	},
	
	clone : function (ob)
	{
		return jz.extend([], ob);
	},
	
	for_exec : function (ob, fn)
	{ 
		return function()
		{ 
			return fn.apply(ob, arguments); 
		}
	},
		
	include : function(file)
	{
		if(typeof file == "undefined") return false;
		var ext = file.substring(file.length - 3, file.length);
		
		if(ext == "css")
		{
			var ncss = document.createElement('link');
			ncss.setAttribute("rel", "stylesheet");
			ncss.setAttribute("type", "text/css");
			ncss.setAttribute("media", "screen");
			ncss.setAttribute("href", file);
			document.getElementsByTagName("head")[0].appendChild(ncss);
			return ncss;
		}
		else if(ext == ".js")
		{
			var njs = document.createElement('script');
			njs.setAttribute("type", "text/javascript");
			njs.setAttribute("src", file);
			document.getElementsByTagName("body")[0].appendChild(njs);
			return njs;
		}
		return false;
	}

};