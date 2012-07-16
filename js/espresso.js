//This will initialize the espresso slot machine
//Which will randomly select one of three possiblities in each
//slot, and, based on those selections, choose a result, which will
//be displayed in the results section

log = new Log({
	logState : 'none',
});

//This array function is to check if all elements of the array are
//equal to the same value. I have to iterate through all the elements and check
Array.prototype.elementsEqual = function (val) {
	for (var i = 0; i<this.length; i++) {
		if (this[i] !== val) return false;
	}
	return true;
};


//cpCss stands for cross-platform css...for css3 elements. It just adds the prefixes
var cpCss = function ($el, property, value) {
	var prefixes = ['Webkit', 'Ms', 'O', 'Moz'];
		
	$el.css(property, value);
	for (var i = 0; i<prefixes.length; i++) {
		$el.css(
			prefixes[i] + property.substring(0,1).toUpperCase() + property.substring(1)
			, value
		);
	}
	
	return $el;
};

var espresso = function ( jq, options ) {
	
	options = $.extend({
		slotsSelector :			'li',
		leverSelector :			'button'
	}, options);
	
	var 
	slotOptions = [
		['coffee maker',		'teapot',			'espresso machine'],
		['coffee filter',		'tea strainer',		'espresso tamper'],
		['coffee grounds',		'loose tea',		'ground espresso beans'],
	],
	slotImages = ['images/coffee.png', 'images/tea.png', 'images/espresso.png'],
	//currentSlots will hold the current value of each slot, as the column index
	currentSlots = [0, 1, 2],
	
	//if all three answers are in the same row, then it gets that row index's result
	//ex. options are [(0,0), (0,1), 0,2)], then it gets the slotResults[0] answer,
	//otherwise it gets a random failedResult
	slotResults = [
		'coffee',	'tea',	'espresso'
	],
	failedResults = [
		'You have nothing.',
		'Get a job.',
		'You should\'ve eaten your veggies',
		'How long are you going to press that button?',
		'Have you ever thought about getting a life?',
		'You dont have much to do today, huh?',
		'I am really tired of having to do this every time...',
		'You know what? Quit.',
		'NO! YOU CANT HAVE ANYTHING!!'
	],
	$slotsDiv,
	$leverDiv,
	$resultDiv,
	$popupDiv,
	
	//this gets passed around and returned for chaining? Why would there be chaining...
	//it's cool, so we DONT CARE. o__O
	obj;
	
	//instantiate the popupDiv
	$popupDiv = $('<div class="popupDiv"></div>')
		.append('<h1 class="PDHeading">Awesome.</h1>')
		.appendTo(document.body)
		.hide()
		.on('click', function (e) {
			$popupDiv.fadeOut();
		});
	
	
	//slots functions
	var 
	slots = {
		//this will hold the slotRotator items
		items : [],
		slotsInt : false,
		
		//this will choose random indices and apply them to the currentSlots
		//array, to represent the values
		pickRandomSlots : function () {
			for (var i=0; i < slotOptions.length; i++) {
				var currentNumber = currentSlots[i];
				while (currentSlots[i] == currentNumber) {
					currentSlots[i] = parseInt(Math.random() * slotOptions.length);
				}
			}
			return obj;
		},
		
		//this sets up the slot "lists" so that I can spin them individually later...
		//or change the class to the appropriate one...
		init : function () {
			
			var $slotsDivItems = $slotsDiv.find(options.slotsSelector);
			for (var i=0; i < $slotsDivItems.length; i++) {
				slots.items.push( slots.slotRotater( $slotsDivItems.eq(i), i) );
			}
			
		},
		
		//this checks each of the slots to see of they're in the same column.
		//if so, then it returns the winning message, otherwise, a failure message
		showSuccessMessage : function () {
			var message,
				popupMessage = false;
			
			if ( currentSlots.elementsEqual(currentSlots[0]) ) {
				//if all elements equal the first one, then they're all in the same column
				//now i have to extract the correct success message for said column
				message = 'CONGRATULATIONS! You got ' + slotResults[currentSlots[0]].toUpperCase() + '!!';
				popupMessage = 'You got ' + slotResults[currentSlots[0]] + '!!';
			} else {
				//otherwise...return a random failure message
				message = failedResults[ parseInt( Math.random() * (failedResults.length - 1) ) ];
			}
			
			$resultDiv.html( message );
								
			if ( popupMessage != false ) {
				$resultDiv.highlight();
				$popupDiv
					.find('.PDHeading').html(popupMessage)
				$popupDiv.fadeIn();
			}
			
		},
		
		render : function (afterFunction) {
			//find the lis in the slotsDiv and animate them all to the currentSlots values.
			var $slotsDivLis = $slotsDiv.find(options.slotsSelector);
			
			afterFunction = afterFunction || function () {};
			
			clearInterval(slots.slotsInt);
			slots.slotsInt = setTimeout(function () {
				afterFunction();
			}, 1000);
			
			for (var i=0; i < slots.items.length; i++) {
				var slot = slots.items[i];
				slots.items[i].spin(currentSlots[i]);
			
			}
			
		}
	};
	slots.slotRotater = function ($el, index) {
		//this defines a single rotater
		//when it is called, it takes the element and constructs out of it a list
		//that creates a triangle out of the faces...that can rotate
		
		$el.html('');
		
		var 
		$list = $('<ul class="rotator clean"></ul>')
			.appendTo($el),
		faces = slotOptions[index],
		
		faceHeight = 100,
		faceWidth = 100;
		
		//The $list is going to be the height and width of 1 face.
		//its transform origin is going to be in the middle, x, y, and z
		
		$list.css({
			position:'relative',
			width : faceWidth,
			height : faceHeight
		});
		
		for (var i=0; i<faces.length; i++) {
			var $face = $('<li class="rotatorFace f'+(i+1)+'"></li>')
				.append('<span class="RFText">' + faces[i] + '</span>');
			$list.append( $face );
		};
		
		
		var spin = function (faceIndex, sec) {
			faceIndex = faceIndex + 1;
			
			$list.removeClass('active1 active2 active3');
			$list.addClass('active' + faceIndex);
			
		};
		
		var obj = {
			spin : spin,
		};
		
		return obj;
	};
	
	var init = function ( initOptions ) {
		
		initOptions = $.extend({
			slots : jq.children().eq(0),
			lever : jq.children().eq(1),
			result : jq.children().eq(2)
		}, initOptions);
		
		
		//first, get the divs I need. (Or whatever they are...)
		$slotsDiv = $(initOptions.slots),
		$leverDiv = $(initOptions.lever),
		$resultDiv = $(initOptions.result);
		
		//now, we need to set the slots to their starting position,
		//by creating a list that contains the items that can be shown,
		//and setting that up as a css3 triangle that will rotate around the x axis
		slots.init();
		
		//set the button to trigger the getAnAnswer function
		var buttonHandler = function (e) {
			e.preventDefault();
			$(e.target).css({
				opacity:0.2
			})
			.prop('disabled', true);
			
			slots.pickRandomSlots();
			slots.render(function () {
				slots.showSuccessMessage();
				
				$(e.target).css({
					opacity:1
				})
				.prop('disabled', false);
			});
			
		};
		$leverDiv.find(options.leverSelector).on({
			'click'	:	buttonHandler
		});
		
		return obj;
		
	};
	
	//the public facing section
	obj = {
		init : init,
		jq : function () {
			return jq;
		},
	};
	
	return obj;
};