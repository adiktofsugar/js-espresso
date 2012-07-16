log = new Log({
	logState : 'none',
});

(function ($, originalAnimateMethod) {

	//overwrite the color animations so I can do the highlight thing...
	//definitely overkill but I want to do it...
	$.each(['backgroundColor', 'color'], function (i, attr) {
	
	//get the actual color of an object...it's parent...unlimited...
	function getColor(elem, attr) {
		var color;
		
		do{
			//curCSS is jquery's cross browser way of getting the actual css value.
			//ridiculous how long it is. This is why i use frameworks now. Ah...i 
			//love you jquery...
			color = $.curCSS(elem, attr);
			
			// get something from this element or a parent's element...
			if ( color != '' && color != 'transparent' || $.nodeName(elem, 'body')) {
				if ($.nodeName(elem, 'body')) color = '#ffffff';
				break;
			}
		} while (elem = elem.parentNode);
		
		return getRgba(color);
	}
	
	//this evaluates a string and converts it into an rgb array.
	//I default to ffffff
	function getRgba(colorString) {
		colorString = (colorString && colorString != '')?colorString:'#ffffff';
		var m;
		
		if ( m = colorString.match(/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/) ) {
			return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16), 1.0];
		} else if (m = colorString.match(/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/)) {
			return [parseInt(m[1] + m[1], 16), parseInt(m[2] + m[2], 16), parseInt(m[3] + m[3], 16), 1.0];
		} else if (m = colorString.match(/^rgb\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)\s*\)$/) ) {
			return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10), 1.0];
		} else if (m = colorString.match(/^rgba\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)[,\s]+([\d\.]+)\s*\)$/) ) {
			
			var r = [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10), parseFloat(m[4])];
			log ('rgba colorstring ' + colorString, r);
			return r;
		}
		
		log ('nothing worked with color string ' + colorString);
		return [255,255,255,1.0];
	}
	
	//jquery is ridiculous. The jquery.fx object is a function, and can thus be instantiated
	//however, it has some class properties and methods too, like the following "step" property
	// or object, which contains a _default and opacity keys by default. The instance's update
	// function then calls this class method with itself as the argument, which probably makes the
	// most sense with animation, since it deals with global objects a lot more than it should...
	// ...and it conveniently allows me to overwrite parts of the animate function....hehe
	$.fx.step[attr] = function (fx) {
		//fx is a jQuery fx object (instance)
		//it has options, elem, and prop properties
		//and some functions that I don't think I care about...at this point anyway..
		// at this point, it also has a
		// now, which is ...the pos * the time difference...so it should be a number that some
		// 		how indicates the multiplier I would apply to numbers that transform...
		
		//the most basic are the start and end properties that are created
		//with the fx.custom function...which I'm guessing is the basis of all the animations...
		
		//first get rgb style values from whatever I pass in...which is only going to be
		//rgb values, or default to an rgb value of white.
		if (!fx.colorInit) {
			fx.start = getColor(fx.elem, attr);
			fx.end = getRgba(fx.end);
			fx.colorInit = true;
		}
		log ('r = ' + (fx.pos * parseInt((fx.end[0] - fx.start[0]) + fx.start[0], 10)) );
		
		fx.elem.style[attr] = 'rgba(' +
			Math.max(Math.min(parseInt((fx.pos * (fx.end[0] - fx.start[0])) + fx.start[0], 10), 255), 0) + ',' +
			Math.max(Math.min(parseInt((fx.pos * (fx.end[1] - fx.start[1])) + fx.start[1], 10), 255), 0) + ',' +
			Math.max(Math.min(parseInt((fx.pos * (fx.end[2] - fx.start[2])) + fx.start[2], 10), 255), 0) + ',' +
			parseFloat((fx.pos * (fx.end[3] - fx.start[3])) + fx.start[3]) + ')';
		
	};
	
	});
	
	var 
	dataKey = 'highlight-data-key',
	methods = {
		init : function (options) {
			options = $.extend({
				color : '#ffff66',
				animateTime : 1050,
			}, options);
			
			return this.each(function () {
			
				var $this = $(this),
					animation = {
						backgroundColor : $this.css('backgroundColor'),
					};
				
				$this.css({
					backgroundColor: options.color,
				});
				//make the background color animate to normal
				$this.animate(animation, options.animateTime);
			});
		}
	};

	$.fn.highlight = function ( options ) {
		return methods.init.call( this, options );
	};

}(jQuery, jQuery.fn.animate));