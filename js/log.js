
var extend = function (target, src) {
    //Only deals with objects. If terrible things happen..../shrug
	//src overwrites keys in target
	
	for (var key in src) {
		if (!src.hasOwnProperty(key)) continue;
		
		target[key] = src[key];
		
	}

    // Return the modified object
    return target;
}

var Log = function ( options ) {
	options = options || {};
	
	options = extend({
		logState : 'none',
		logStates : [
			'none',
			'error',
			'info',
			'debug'
		],
		
	}, options);
	
	
	console.dir();
	// @private
	// @string state
	var levelIndex = function (state) {
		return options.logStates.indexOf(state);
	};
	
	// @private, though this is what is returned...
	// @string msg
	// @object obj
	// @string level
	var log = function (msg, obj, level) {
		level = level || 'debug';
		
		//if the given level (by default, debug) is
		//a higher level than the current logState,
		//don't show it.
		if ( levelIndex(level) > levelIndex(options.logState) ) {
			return;
		}
		
		if (console) {
			if (msg) console.log(msg);
			if (obj) console.dir(obj);
		}
		return;
	};

	return log;
};
