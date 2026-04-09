(function(window, document, $, undefined){

	

	var stage;
	$(window).on('load', function(){
		stage = new Stage();
	});

	

	// EVENTS
	// BIND ARROW KEY DOWN EVENTS
	$(document).keydown(function(event) {
	    switch(event.which) {
	        case 37: // left
	        	stage.keystates.left = true;
				break;
	        case 38: // up
	        	stage.keystates.up = true;
				break;
	        case 39: // right
	        	stage.keystates.right = true;
				break;
	        case 40: // down
	        	stage.keystates.down = true;
				break;
			case 68: // d key for diagnostics
			
				console.log('motion:');
				console.log(stage.rob.motion);
				
				console.log('position:');
				console.log(stage.rob.position);
			
				break;
	        default:
	        	return;
	    }
	    
		// start animation
	    if(! stage.rob.animated) {
	    	stage.frame();
	    }
	    
	    event.preventDefault();
	});
	
	// BIND ARROW KEY UP EVENTS
	$(document).keyup(function(event) {
	    switch(event.which) {
	        case 37: // left
	        	stage.keystates.left = false;
				break;
	        case 38: // up
	        	stage.keystates.up = false;
				break;
	        case 39: // right
	        	stage.keystates.right = false;
				break;
	        case 40: // down
	        	stage.keystates.down = false;
				break;
	        default:
	        	return;
	    }
	    
	    event.preventDefault();
	});






	

	function Stage()
	{
		this.config = {
			fps: 50,
			autoscroll_offset: {
				top: 200,
				right: 200,
				left: 100,
				bottom: 20
			},
			bounds_offset: {
				top: 170,
				right: -150,
				bottom: 50,
				left: -20
			},
			page_width: $(document).width(),
			page_height: $(document).height()
		};
		this.keystates = {
			left: false,
			right: false,
			up: false,
			down: false
		};
		this.timeout = null;
		this.rob = new Rob(10,170);
		this.props = [];
		
		// go!
		this.init();
	}
	
	Stage.prototype = {
		init: function(){
			
			// INITIALIZE PROPS
			this.props.push(new Prop('sign','bio',520,570,635,600));
			this.props.push(new Prop('sign','ecommerce',875,524,1002,562));
			this.props.push(new Prop('sign','development',1262,714,1384,749));
			this.props.push(new Prop('sign','integration',1712,658,1756,687));
			this.props.push(new Prop('sign','skills',2247,696,2370,725));
			this.props.push(new Prop('sign','worksamples',2812,815,2945,845));
			this.props.push(new Prop('sign','workhistory',3263,572,3389,614));
			this.props.push(new Prop('sign','bold',3894,502,3935,531));
			
			this.props.push(new Prop('tree','1',702,808,774,866));
			this.props.push(new Prop('tree','2',1564,818,1582,840));
			this.props.push(new Prop('tree','3',1903,676,2091,735));
			this.props.push(new Prop('tree','4',2546,630,2755,665));
			
			
			// TEMP FOR TESTING
			/*$.each(this.props, function(i,v){
				console.log(v.id);
				$('main').append('<div style="background:red;position:absolute;left:'+v.x1+'px;top:'+v.y1+'px;width:'+(v.x2-v.x1)+'px;height:'+(v.y2-v.y1)+'px;"></div>');
			});
			var robhitbox = this.rob.hitbox();
			$('main').append('<div class="robhitbox" style="background:red;position:absolute;left:'+robhitbox.x1+'px;top:'+robhitbox.y1+'px;width:'+(robhitbox.x2-robhitbox.x1)+'px;height:'+(robhitbox.y2-robhitbox.y1)+'px;"></div>');
			*/
		},
		
		frame: function(){
			
			if(! this.rob.element.hasClass('walking')) { // JUST STARTED WALKING
				this.rob.startAnimation();
			}				

			this.rob.updateAnimation();
			this.autoScroll();
			
			// NEXT FRAME?
			if(this.keystates.left || this.keystates.right || this.keystates.up || this.keystates.down) 
			{
				// Still moving
				clearTimeout(this.timeout);
				this.timeout = window.setTimeout(this.frame.bind(stage), (1000 / this.config.fps));
			}
			else
			{
				// Stopped moving
				this.rob.stopAnimation();
			}
			
		},
		
		autoScroll: function(){
			
			// CALCULATE SCROLL BOUNDS
			var scrollbounds = {
				left: $(window).scrollLeft() + this.config.autoscroll_offset.left,
				right: $(window).scrollLeft() + window.innerWidth - this.rob.width - this.config.autoscroll_offset.right,
				top: $(window).scrollTop() + this.config.autoscroll_offset.top,
				bottom: $(window).scrollTop() + window.innerHeight - this.rob.height - this.config.autoscroll_offset.bottom
			};
			
			// SCROLL X
			if(this.rob.position.x > scrollbounds.right && $(window).scrollLeft() < stage.config.page_width - window.innerWidth) {
				$(window).scrollLeft(this.rob.position.x - window.innerWidth + this.rob.width + this.config.autoscroll_offset.right);
			} else if(this.rob.position.x < scrollbounds.left && $(window).scrollLeft() < stage.config.page_width - window.innerWidth) {
				$(window).scrollLeft(this.rob.position.x - this.config.autoscroll_offset.left);
			}
			
			// SCROLL Y
			if(this.rob.position.y > scrollbounds.bottom) {
				$(window).scrollTop(this.rob.position.y - window.innerHeight + this.rob.height + this.config.autoscroll_offset.bottom);
			} else if(this.rob.position.y < scrollbounds.top) {
				$(window).scrollTop(this.rob.position.y - this.config.autoscroll_offset.top);
			}
		},
		
		inBounds: {
			x: function(){
				return 	stage.rob.position.x + stage.rob.motion.x >= 0 + stage.config.bounds_offset.left &&
						stage.rob.position.x + stage.rob.width + stage.rob.motion.x <= stage.config.page_width - stage.config.bounds_offset.right;
			},
			y: function(){
				return 	stage.rob.position.y + stage.rob.motion.y >= 0 + stage.config.bounds_offset.top &&
						stage.rob.position.y + stage.rob.height + stage.rob.motion.y <= stage.config.page_height - stage.config.bounds_offset.bottom;
			}
		},
		
		boxCollide: function(a,b){
			if(a.x2 < b.x1) return false;
			if(a.x1 > b.x2) return false;
			if(a.y2 < b.y1) return false;
			if(a.y1 > b.y2) return false;
			return true;
		},
		
		boxDistance: function(a,b){
			var acenter = this.boxCenter(a);
			var bcenter = this.boxCenter(b);
			var distance = Math.sqrt( Math.pow((acenter.x - bcenter.x), 2) + Math.pow((acenter.y - bcenter.y), 2) );
			return Math.round(distance);
		},
		
		boxCenter: function(box) {
			return {
				x: (box.x2-box.x1)/2 + box.x1,
				y: (box.y2-box.y1)/2 + box.y1
			};
		},
		
		closestProp: function(distanceto){
			var shortestdistance;
			var closestprop;
			for(var i=0; i<this.props.length; i++) {
				var distance = this.boxDistance(distanceto,this.props[i]);
				if(typeof shortestdistance === 'undefined' || distance < shortestdistance) {
					shortestdistance = distance;
					closestprop = this.props[i];
				}
			}
			closestprop.robdistance = shortestdistance;
			return closestprop;
		}
		
	};

	
	function Rob(x, y)
	{
		this.position = {
			x: x,
			y: y
		};
		this.motion = {
			x: 0,
			y: 0
		};
		this.animated = false;
		this.element = $('.rob');
		this.pixelstep = 5;   // pixels to move during each frame
		this.width = 120;
		this.height = 222;
	}

	Rob.prototype = {
		hitbox: function(){
			return {
				x1: this.position.x + this.motion.x + 35,
				y1: this.position.y + this.motion.y + 192,
				x2: this.position.x + this.motion.x + 85,
				y2: this.position.y + this.motion.y + 222
			};
		},
		startAnimation: function(){
			this.animated = true;
			this.element.addClass('walking');
		},
		stopAnimation: function(){
			this.animated = false;
			this.element.removeClass('walking');
		},
		updateAnimation: function(){
			
			// calculate new x motion
			if(stage.keystates.left) this.motion.x = -1  *  this.pixelstep;
			else if(stage.keystates.right) this.motion.x = 1  *  this.pixelstep;
			else this.motion.x = 0;
			
			// calculate new y motion
			if(stage.keystates.up) this.motion.y = -1  *  this.pixelstep;
			else if(stage.keystates.down) this.motion.y = 1  *  this.pixelstep;
			else this.motion.y = 0;
			
			// Switch sprite direction based on anticipated x motion
			if(this.motion.x < 0) this.element.addClass('flippedx');
			if(this.motion.x > 0) this.element.removeClass('flippedx');
			
			// Check bounds
			if(! stage.inBounds.x()) this.motion.x = 0;
			if(! stage.inBounds.y()) this.motion.y = 0;
			
			// Check prop collisions
			var robhitbox = this.hitbox();
			var robcollides = false;
			var closestprop = stage.closestProp(robhitbox);
			if( stage.boxCollide(robhitbox,closestprop) )
				robcollides = true;
			
			// update prop z-index
			if( robhitbox.y2 > closestprop.y2 - 5 ) {
				this.element.css({ 'z-index':20 });
				closestprop.element.css({ 'z-index':10 });
			} else {
				this.element.css({ 'z-index':10 });
				closestprop.element.css({ 'z-index':20 });
			}
			
			// stop movement if we collided with something
			if(robcollides) {
				this.motion.x = 0;
				this.motion.y = 0;
			}
			
			// show resume parts
			closestprop.resumeCheck();
			
			// show resume end
			if(this.position.x > stage.config.page_width)
				window.location = 'rob.html';
			
			// stop animation if rob stopped moving on both axes
			if(this.motion.x === 0 && this.motion.y === 0) this.stopAnimation();
			
			// Update position and move DOM element
			this.position.x += this.motion.x;
			this.position.y += this.motion.y;
			this.element.css({
				left: this.position.x + 'px',
				top: this.position.y + 'px'
			});
			
			// TEMP FOR TESTING
			/*var robhitbox = this.hitbox();
			$('.robhitbox').css({
				left: robhitbox.x1 + 'px',
				top: robhitbox.y1 + 'px'
			});
			*/
			
			
		}
	};


	
	// PROPS
	function Prop(type, article, x1, y1, x2, y2)
	{
		this.type = type;
		this.article = article;
		this.id = type + '_' + article;
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		
		this.active_distance = 200;
		
		this.element = $('#'+this.id);
		
		if(this.type == 'sign') {
			var thisprop = this;
			this.element.on('click',function(){
				thisprop.showResume(true);
			});
		}
		
	}
	
	Prop.prototype = {
		
		resumeCheck: function(){
			if(this.type == 'sign' && this.robdistance <= this.active_distance) {
				this.showResume();								
			} else {
				$('.resumebox article:visible').slideUp(400);
			}
		},
		
		showResume: function(clicked){
			
			$('.intro').fadeOut();
			
			if(typeof clicked === 'undefined') clicked = false;
			
			var thisarticle = $('.resumebox article[role='+this.article+']');
			if(clicked && thisarticle.is(':visible')) {
				thisarticle.slideUp(400);
			} else {
				var visible_article = $('.resumebox article:visible:not([role='+this.article+'])');
				if(visible_article.length > 0) {
					var thisprop = this;
					visible_article.slideUp(400,function(){
						$('.resumebox article[role='+thisprop.article+']').slideDown(400);
					});
				} else {
					$('.resumebox article[role='+this.article+']').slideDown(400);
				}
			}

		}
		
	};
	
	
	
	
	
	

})(window, document, jQuery);