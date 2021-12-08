// Utility function
function Util () {};

/* 
	class manipulation functions
*/
Util.hasClass = function(el, className) {
	return el.classList.contains(className);
};

Util.addClass = function(el, className) {
	var classList = className.split(' ');
 	el.classList.add(classList[0]);
 	if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
	var classList = className.split(' ');
	el.classList.remove(classList[0]);	
	if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
	if(bool) Util.addClass(el, className);
	else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/* 
  DOM manipulation
*/
Util.getChildrenByClassName = function(el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < children.length; i++) {
    if (Util.hasClass(children[i], className)) childrenByClass.push(children[i]);
  }
  return childrenByClass;
};

Util.is = function(elem, selector) {
  if(selector.nodeType){
    return elem === selector;
  }

  var qa = (typeof(selector) === 'string' ? document.querySelectorAll(selector) : selector),
    length = qa.length,
    returnArr = [];

  while(length--){
    if(qa[length] === elem){
      return true;
    }
  }

  return false;
};

/* 
	Animate height of an element
*/
Util.setHeight = function(start, to, element, duration, cb, timeFunction) {
	var change = to - start,
	    currentTime = null;

  var animateHeight = function(timestamp){  
    if (!currentTime) currentTime = timestamp;         
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = parseInt((progress/duration)*change + start);
    if(timeFunction) {
      val = Math[timeFunction](progress, start, to - start, duration);
    }
    element.style.height = val+"px";
    if(progress < duration) {
        window.requestAnimationFrame(animateHeight);
    } else {
    	if(cb) cb();
    }
  };
  
  //set the height of the element before starting animation -> fix bug on Safari
  element.style.height = start+"px";
  window.requestAnimationFrame(animateHeight);
};

/* 
	Smooth Scroll
*/

Util.scrollTo = function(final, duration, cb, scrollEl) {
  var element = scrollEl || window;
  var start = element.scrollTop || document.documentElement.scrollTop,
    currentTime = null;

  if(!scrollEl) start = window.scrollY || document.documentElement.scrollTop;
      
  var animateScroll = function(timestamp){
  	if (!currentTime) currentTime = timestamp;        
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final-start, duration);
    element.scrollTo(0, val);
    if(progress < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/* 
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};

/* 
  Misc
*/

Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function(property, value) {
  if('CSS' in window) {
    return CSS.supports(property, value);
  } else {
    var jsProperty = property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase();});
    return jsProperty in document.body.style;
  }
};

// merge a set of user options into plugin defaults
// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
Util.extend = function() {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
    deep = arguments[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = function (obj) {
    for ( var prop in obj ) {
      if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        // If deep merge and property is an object, merge properties
        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
          extended[prop] = extend( true, extended[prop], obj[prop] );
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for ( ; i < length; i++ ) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// Check if Reduced Motion is enabled
Util.osHasReducedMotion = function() {
  if(!window.matchMedia) return false;
  var matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
}; 

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1); 
		return null;
	};
}

//Custom Event() constructor
if ( typeof window.CustomEvent !== "function" ) {

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

Math.easeInQuart = function (t, b, c, d) {
	t /= d;
	return c*t*t*t*t + b;
};

Math.easeOutQuart = function (t, b, c, d) { 
  t /= d;
	t--;
	return -c * (t*t*t*t - 1) + b;
};

Math.easeInOutQuart = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t*t + b;
	t -= 2;
	return -c/2 * (t*t*t*t - 2) + b;
};

Math.easeOutElastic = function (t, b, c, d) {
  var s=1.70158;var p=d*0.7;var a=c;
  if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
  if (a < Math.abs(c)) { a=c; var s=p/4; }
  else var s = p/(2*Math.PI) * Math.asin (c/a);
  return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
};


/* JS Utility Classes */

// make focus ring visible only for keyboard navigation (i.e., tab key) 
(function() {
  var focusTab = document.getElementsByClassName('js-tab-focus'),
    shouldInit = false,
    outlineStyle = false,
    eventDetected = false;

  function detectClick() {
    if(focusTab.length > 0) {
      resetFocusStyle(false);
      window.addEventListener('keydown', detectTab);
    }
    window.removeEventListener('mousedown', detectClick);
    outlineStyle = false;
    eventDetected = true;
  };

  function detectTab(event) {
    if(event.keyCode !== 9) return;
    resetFocusStyle(true);
    window.removeEventListener('keydown', detectTab);
    window.addEventListener('mousedown', detectClick);
    outlineStyle = true;
  };

  function resetFocusStyle(bool) {
    var outlineStyle = bool ? '' : 'none';
    for(var i = 0; i < focusTab.length; i++) {
      focusTab[i].style.setProperty('outline', outlineStyle);
    }
  };

  function initFocusTabs() {
    if(shouldInit) {
      if(eventDetected) resetFocusStyle(outlineStyle);
      return;
    }
    shouldInit = focusTab.length > 0;
    window.addEventListener('mousedown', detectClick);
  };

  initFocusTabs();
  window.addEventListener('initFocusTabs', initFocusTabs);
}());

function resetFocusTabsStyle() {
  window.dispatchEvent(new CustomEvent('initFocusTabs'));
};
// File#: _1_accordion
// Usage: codyhouse.co/license
(function() {
	var Accordion = function(element) {
		this.element = element;
		this.items = Util.getChildrenByClassName(this.element, 'js-accordion__item');
		this.version = this.element.getAttribute('data-version') ? '-'+this.element.getAttribute('data-version') : '';
		this.showClass = 'accordion'+this.version+'__item--is-open';
		this.animateHeight = (this.element.getAttribute('data-animation') == 'on');
		this.multiItems = !(this.element.getAttribute('data-multi-items') == 'off'); 
		// deep linking options
		this.deepLinkOn = this.element.getAttribute('data-deep-link') == 'on';
		// init accordion
		this.initAccordion();
	};

	Accordion.prototype.initAccordion = function() {
		//set initial aria attributes
		for( var i = 0; i < this.items.length; i++) {
			var button = this.items[i].getElementsByTagName('button')[0],
				content = this.items[i].getElementsByClassName('js-accordion__panel')[0],
				isOpen = Util.hasClass(this.items[i], this.showClass) ? 'true' : 'false';
			Util.setAttributes(button, {'aria-expanded': isOpen, 'aria-controls': 'accordion-content-'+i, 'id': 'accordion-header-'+i});
			Util.addClass(button, 'js-accordion__trigger');
			Util.setAttributes(content, {'aria-labelledby': 'accordion-header-'+i, 'id': 'accordion-content-'+i});
		}

		//listen for Accordion events
		this.initAccordionEvents();

		// check deep linking option
		this.initDeepLink();
	};

	Accordion.prototype.initAccordionEvents = function() {
		var self = this;

		this.element.addEventListener('click', function(event) {
			var trigger = event.target.closest('.js-accordion__trigger');
			//check index to make sure the click didn't happen inside a children accordion
			if( trigger && Util.getIndexInArray(self.items, trigger.parentElement) >= 0) self.triggerAccordion(trigger);
		});
	};

	Accordion.prototype.triggerAccordion = function(trigger) {
		var bool = (trigger.getAttribute('aria-expanded') === 'true');

		this.animateAccordion(trigger, bool, false);

		if(!bool && this.deepLinkOn) {
			history.replaceState(null, '', '#'+trigger.getAttribute('aria-controls'));
		}
	};

	Accordion.prototype.animateAccordion = function(trigger, bool, deepLink) {
		var self = this;
		var item = trigger.closest('.js-accordion__item'),
			content = item.getElementsByClassName('js-accordion__panel')[0],
			ariaValue = bool ? 'false' : 'true';

		if(!bool) Util.addClass(item, this.showClass);
		trigger.setAttribute('aria-expanded', ariaValue);
		self.resetContentVisibility(item, content, bool);

		if( !this.multiItems && !bool || deepLink) this.closeSiblings(item);
	};

	Accordion.prototype.resetContentVisibility = function(item, content, bool) {
		Util.toggleClass(item, this.showClass, !bool);
		content.removeAttribute("style");
		if(bool && !this.multiItems) { // accordion item has been closed -> check if there's one open to move inside viewport 
			this.moveContent();
		}
	};

	Accordion.prototype.closeSiblings = function(item) {
		//if only one accordion can be open -> search if there's another one open
		var index = Util.getIndexInArray(this.items, item);
		for( var i = 0; i < this.items.length; i++) {
			if(Util.hasClass(this.items[i], this.showClass) && i != index) {
				this.animateAccordion(this.items[i].getElementsByClassName('js-accordion__trigger')[0], true, false);
				return false;
			}
		}
	};

	Accordion.prototype.moveContent = function() { // make sure title of the accordion just opened is inside the viewport
		var openAccordion = this.element.getElementsByClassName(this.showClass);
		if(openAccordion.length == 0) return;
		var boundingRect = openAccordion[0].getBoundingClientRect();
		if(boundingRect.top < 0 || boundingRect.top > window.innerHeight) {
			var windowScrollTop = window.scrollY || document.documentElement.scrollTop;
			window.scrollTo(0, boundingRect.top + windowScrollTop);
		}
	};

	Accordion.prototype.initDeepLink = function() {
		if(!this.deepLinkOn) return;
		var hash = window.location.hash.substr(1);
		if(!hash || hash == '') return;
		var trigger = this.element.querySelector('.js-accordion__trigger[aria-controls="'+hash+'"]');
		if(trigger && trigger.getAttribute('aria-expanded') !== 'true') {
			this.animateAccordion(trigger, false, true);
			setTimeout(function(){trigger.scrollIntoView(true);});
		}
	};

	window.Accordion = Accordion;
	
	//initialize the Accordion objects
	var accordions = document.getElementsByClassName('js-accordion');
	if( accordions.length > 0 ) {
		for( var i = 0; i < accordions.length; i++) {
			(function(i){new Accordion(accordions[i]);})(i);
		}
	}
}());
// File#: _1_anim-menu-btn
// Usage: codyhouse.co/license
(function() {
	var menuBtns = document.getElementsByClassName('js-anim-menu-btn');
	if( menuBtns.length > 0 ) {
		for(var i = 0; i < menuBtns.length; i++) {(function(i){
			initMenuBtn(menuBtns[i]);
		})(i);}

		function initMenuBtn(btn) {
			btn.addEventListener('click', function(event){	
				event.preventDefault();
				var status = !Util.hasClass(btn, 'anim-menu-btn--state-b');
				Util.toggleClass(btn, 'anim-menu-btn--state-b', status);
				// emit custom event
				var event = new CustomEvent('anim-menu-btn-clicked', {detail: status});
				btn.dispatchEvent(event);
			});
		};
	}
}());
// File#: _1_google-maps
// Usage: codyhouse.co/license
function initGoogleMap() {
  var contactMap = document.getElementsByClassName('js-google-maps');
  if(contactMap.length > 0) {
    for(var i = 0; i < contactMap.length; i++) {
      initContactMap(contactMap[i]);
    }
  }
};

function initContactMap(wrapper) {
  var coordinate = wrapper.getAttribute('data-coordinates').split(',');
  var map = new google.maps.Map(wrapper, {zoom: 10, center: {lat: Number(coordinate[0]), lng:  Number(coordinate[1])}});
  var marker = new google.maps.Marker({position: {lat: Number(coordinate[0]), lng:  Number(coordinate[1])}, map: map});
};
// File#: _1_immersive-section-transition
// Usage: codyhouse.co/license
(function() {
  var ImmerseSectionTr = function(element) {
    this.element = element;
    this.media = this.element.getElementsByClassName('js-immerse-section-tr__media');
    this.scrollContent = this.element.getElementsByClassName('js-immerse-section-tr__content');
    if(this.media.length < 1) return;
    this.figure = this.media[0].getElementsByClassName('js-immerse-section-tr__figure');
    if(this.figure.length < 1) return;
    this.visibleFigure = false;
    this.mediaScale = 1;
    this.mediaInitHeight = 0;
    this.elementPadding = 0;
    this.scrollingFn = false;
    this.scrolling = false;
    this.active = false;
    this.scrollDelta = 0; // amount to scroll for full-screen scaleup
    initImmerseSectionTr(this);
  };

  function initImmerseSectionTr(element) {
    initContainer(element);
    resetSection(element);

    // listen to resize event and reset values
    element.element.addEventListener('update-immerse-section', function(event){
      resetSection(element);
    });

    // detect when the element is sticky - update scale value and opacity layer 
    var observer = new IntersectionObserver(immerseSectionTrCallback.bind(element));
    observer.observe(element.media[0]);
  };

  function resetSection(element) {
    getVisibleFigure(element);
    checkEffectActive(element);
    if(element.active) {
      Util.removeClass(element.element, 'immerse-section-tr--disabled');
      updateMediaHeight(element);
      getMediaScale(element); 
      updateMargin(element);
      setScaleValue.bind(element)();
    } else {
      // reset appearance
      Util.addClass(element.element, 'immerse-section-tr--disabled');
      element.media[0].style = '';
      element.scrollContent[0].style = '';
      updateScale(element, 1);
      updateOpacity(element, 0);
    }
    element.element.dispatchEvent(new CustomEvent('immersive-section-updated', {detail: {active: element.active, asset: element.visibleFigure}}));
  };

  function getVisibleFigure(element) { // get visible figure element
    element.visibleFigure = false;
    for(var i = 0; i < element.figure.length; i++) {
      if(window.getComputedStyle(element.figure[i]).getPropertyValue('display') != 'none') {
        element.visibleFigure = element.figure[i];
        break;
      }
    }
  };

  function updateMediaHeight(element) { // set sticky element padding/margin + height
    element.mediaInitHeight = element.visibleFigure.offsetHeight;
    element.scrollDelta = (window.innerHeight - element.visibleFigure.offsetHeight) > (window.innerWidth - element.visibleFigure.offsetWidth)
      ? (window.innerHeight - element.visibleFigure.offsetHeight)/2
      : (window.innerWidth - element.visibleFigure.offsetWidth)/2;
    if(element.scrollDelta > window.innerHeight) element.scrollDelta = window.innerHeight;
    if(element.scrollDelta < 200) element.scrollDelta = 200;
    element.media[0].style.height = window.innerHeight+'px';
    element.media[0].style.paddingTop = (window.innerHeight - element.visibleFigure.offsetHeight)/2+'px';
    element.media[0].style.marginTop = (element.visibleFigure.offsetHeight - window.innerHeight)/2+'px';
  };

  function getMediaScale(element) { // get media final scale value
    var scaleX = roundValue(window.innerWidth/element.visibleFigure.offsetWidth),
      scaleY = roundValue(window.innerHeight/element.visibleFigure.offsetHeight);

    element.mediaScale = Math.max(scaleX, scaleY);
    element.elementPadding = parseInt(window.getComputedStyle(element.element).getPropertyValue('padding-top'));
  };

  function roundValue(value) {
    return (Math.ceil(value*100)/100).toFixed(2);
  };

  function updateMargin(element) { // update distance between media and content elements
    if(element.scrollContent.length > 0) element.scrollContent[0].style.marginTop = element.scrollDelta+'px';
  };

  function setScaleValue() { // update asset scale value
    if(!this.active) return; // effect is not active
    var offsetTop = (window.innerHeight - this.mediaInitHeight)/2;
    var top = this.element.getBoundingClientRect().top + this.elementPadding;

    if( top < offsetTop && top > offsetTop - this.scrollDelta) {
      var scale = 1 + (top - offsetTop)*(1 - this.mediaScale)/this.scrollDelta;
      updateScale(this, scale);
      updateOpacity(this, 0);
    } else if(top >= offsetTop) {
      updateScale(this, 1);
      updateOpacity(this, 0);
    } else {
      updateScale(this, this.mediaScale);
      updateOpacity(this, 1.8*( offsetTop - this.scrollDelta - top)/ window.innerHeight);
    }

    this.scrolling = false;
  };

  function updateScale(element, value) { // apply new scale value
    element.visibleFigure.style.transform = 'scale('+value+')';
    element.visibleFigure.style.msTransform = 'scale('+value+')';
  };

  function updateOpacity(element, value) { // update layer opacity
    element.element.style.setProperty('--immerse-section-tr-opacity', value);
  };

  function immerseSectionTrCallback(entries) { // intersectionObserver callback
    if(entries[0].isIntersecting) {
      if(this.scrollingFn) return; // listener for scroll event already added
      immerseSectionTrScrollEvent(this);
    } else {
      if(!this.scrollingFn) return; // listener for scroll event already removed
      window.removeEventListener('scroll', this.scrollingFn);
      this.scrollingFn = false;
    }
  };

  function immerseSectionTrScrollEvent(element) { // listen to scroll when asset element is inside the viewport
    element.scrollingFn = immerseSectionTrScrolling.bind(element);
    window.addEventListener('scroll', element.scrollingFn);
  };

  function immerseSectionTrScrolling() { // update asset scale on scroll
    if(this.scrolling) return;
    this.scrolling = true;
    window.requestAnimationFrame(setScaleValue.bind(this));
  };

  function initContainer(element) {
    // add a padding to the container to fix the collapsing-margin issue
    if(parseInt(window.getComputedStyle(element.element).getPropertyValue('padding-top')) == 0) element.element.style.paddingTop = '1px';
  };

  function checkEffectActive(element) { //check if effect needs to be activated
    element.active = true;
    if(element.visibleFigure.offsetHeight >= window.innerHeight) element.active = false;
    if( window.innerHeight - element.visibleFigure.offsetHeight >= 600) element.active = false;
  };

  //initialize the ImmerseSectionTr objects
  var immerseSections = document.getElementsByClassName('js-immerse-section-tr'),
    reducedMotion = Util.osHasReducedMotion(),
    intObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);

  if(immerseSections.length < 1 ) return;
	if( !reducedMotion && intObserverSupported) {
    var immerseSectionsArray = [];
		for( var i = 0; i < immerseSections.length; i++) {
      (function(i){immerseSectionsArray.push(new ImmerseSectionTr(immerseSections[i]));})(i);
    }

    if(immerseSectionsArray.length > 0) {
      var resizingId = false,
        customEvent = new CustomEvent('update-immerse-section');
      
      window.addEventListener('resize', function() {
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 500);
      });

      function doneResizing() {
        for( var i = 0; i < immerseSectionsArray.length; i++) {
          (function(i){immerseSectionsArray[i].element.dispatchEvent(customEvent)})(i);
        };
      };
    };
  } else { // effect deactivated
    for( var i = 0; i < immerseSections.length; i++) Util.addClass(immerseSections[i], 'immerse-section-tr--disabled');
  }
}());
// File#: _1_menu
// Usage: codyhouse.co/license
(function() {
	var Menu = function(element) {
		this.element = element;
		this.elementId = this.element.getAttribute('id');
		this.menuItems = this.element.getElementsByClassName('js-menu__content');
		this.trigger = document.querySelectorAll('[aria-controls="'+this.elementId+'"]');
		this.selectedTrigger = false;
		this.menuIsOpen = false;
		this.initMenu();
		this.initMenuEvents();
	};	

	Menu.prototype.initMenu = function() {
		// init aria-labels
		for(var i = 0; i < this.trigger.length; i++) {
			Util.setAttributes(this.trigger[i], {'aria-expanded': 'false', 'aria-haspopup': 'true'});
		}
		// init tabindex
		for(var i = 0; i < this.menuItems.length; i++) {
			this.menuItems[i].setAttribute('tabindex', '0');
		}
	};

	Menu.prototype.initMenuEvents = function() {
		var self = this;
		for(var i = 0; i < this.trigger.length; i++) {(function(i){
			self.trigger[i].addEventListener('click', function(event){
				event.preventDefault();
				// if the menu had been previously opened by another trigger element -> close it first and reopen in the right position
				if(Util.hasClass(self.element, 'menu--is-visible') && self.selectedTrigger !=  self.trigger[i]) {
					self.toggleMenu(false, false); // close menu
				}
				// toggle menu
				self.selectedTrigger = self.trigger[i];
				self.toggleMenu(!Util.hasClass(self.element, 'menu--is-visible'), true);
			});
		})(i);}
		
		// keyboard events
		this.element.addEventListener('keydown', function(event) {
			// use up/down arrow to navigate list of menu items
			if( !Util.hasClass(event.target, 'js-menu__content') ) return;
			if( (event.keyCode && event.keyCode == 40) || (event.key && event.key.toLowerCase() == 'arrowdown') ) {
				self.navigateItems(event, 'next');
			} else if( (event.keyCode && event.keyCode == 38) || (event.key && event.key.toLowerCase() == 'arrowup') ) {
				self.navigateItems(event, 'prev');
			}
		});
	};

	Menu.prototype.toggleMenu = function(bool, moveFocus) {
		var self = this;
		// toggle menu visibility
		Util.toggleClass(this.element, 'menu--is-visible', bool);
		this.menuIsOpen = bool;
		if(bool) {
			this.selectedTrigger.setAttribute('aria-expanded', 'true');
			Util.moveFocus(this.menuItems[0]);
			this.element.addEventListener("transitionend", function(event) {Util.moveFocus(self.menuItems[0]);}, {once: true});
			// position the menu element
			this.positionMenu();
			// add class to menu trigger
			Util.addClass(this.selectedTrigger, 'menu-control--active');
		} else if(this.selectedTrigger) {
			this.selectedTrigger.setAttribute('aria-expanded', 'false');
			if(moveFocus) Util.moveFocus(this.selectedTrigger);
			// remove class from menu trigger
			Util.removeClass(this.selectedTrigger, 'menu-control--active');
			this.selectedTrigger = false;
		}
	};

	Menu.prototype.positionMenu = function(event, direction) {
		var selectedTriggerPosition = this.selectedTrigger.getBoundingClientRect(),
			menuOnTop = (window.innerHeight - selectedTriggerPosition.bottom) < selectedTriggerPosition.top;
			// menuOnTop = window.innerHeight < selectedTriggerPosition.bottom + this.element.offsetHeight;
			
		var left = selectedTriggerPosition.left,
			right = (window.innerWidth - selectedTriggerPosition.right),
			isRight = (window.innerWidth < selectedTriggerPosition.left + this.element.offsetWidth);

		var horizontal = isRight ? 'right: '+right+'px;' : 'left: '+left+'px;',
			vertical = menuOnTop
				? 'bottom: '+(window.innerHeight - selectedTriggerPosition.top)+'px;'
				: 'top: '+selectedTriggerPosition.bottom+'px;';
		// check right position is correct -> otherwise set left to 0
		if( isRight && (right + this.element.offsetWidth) > window.innerWidth) horizontal = 'left: '+ parseInt((window.innerWidth - this.element.offsetWidth)/2)+'px;';
		var maxHeight = menuOnTop ? selectedTriggerPosition.top - 20 : window.innerHeight - selectedTriggerPosition.bottom - 20;
		this.element.setAttribute('style', horizontal + vertical +'max-height:'+Math.floor(maxHeight)+'px;');
	};

	Menu.prototype.navigateItems = function(event, direction) {
		event.preventDefault();
		var index = Util.getIndexInArray(this.menuItems, event.target),
			nextIndex = direction == 'next' ? index + 1 : index - 1;
		if(nextIndex < 0) nextIndex = this.menuItems.length - 1;
		if(nextIndex > this.menuItems.length - 1) nextIndex = 0;
		Util.moveFocus(this.menuItems[nextIndex]);
	};

	Menu.prototype.checkMenuFocus = function() {
		var menuParent = document.activeElement.closest('.js-menu');
		if (!menuParent || !this.element.contains(menuParent)) this.toggleMenu(false, false);
	};

	Menu.prototype.checkMenuClick = function(target) {
		if( !this.element.contains(target) && !target.closest('[aria-controls="'+this.elementId+'"]')) this.toggleMenu(false);
	};

	window.Menu = Menu;

	//initialize the Menu objects
	var menus = document.getElementsByClassName('js-menu');
	if( menus.length > 0 ) {
		var menusArray = [];
		var scrollingContainers = [];
		for( var i = 0; i < menus.length; i++) {
			(function(i){
				menusArray.push(new Menu(menus[i]));
				var scrollableElement = menus[i].getAttribute('data-scrollable-element');
				if(scrollableElement && !scrollingContainers.includes(scrollableElement)) scrollingContainers.push(scrollableElement);
			})(i);
		}

		// listen for key events
		window.addEventListener('keyup', function(event){
			if( event.keyCode && event.keyCode == 9 || event.key && event.key.toLowerCase() == 'tab' ) {
				//close menu if focus is outside menu element
				menusArray.forEach(function(element){
					element.checkMenuFocus();
				});
			} else if( event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape' ) {
				// close menu on 'Esc'
				menusArray.forEach(function(element){
					element.toggleMenu(false, false);
				});
			} 
		});
		// close menu when clicking outside it
		window.addEventListener('click', function(event){
			menusArray.forEach(function(element){
				element.checkMenuClick(event.target);
			});
		});
		// on resize -> close all menu elements
		window.addEventListener('resize', function(event){
			menusArray.forEach(function(element){
				element.toggleMenu(false, false);
			});
		});
		// on scroll -> close all menu elements
		window.addEventListener('scroll', function(event){
			menusArray.forEach(function(element){
				if(element.menuIsOpen) element.toggleMenu(false, false);
			});
		});
		// take into account additinal scrollable containers
		for(var j = 0; j < scrollingContainers.length; j++) {
			var scrollingContainer = document.querySelector(scrollingContainers[j]);
			if(scrollingContainer) {
				scrollingContainer.addEventListener('scroll', function(event){
					menusArray.forEach(function(element){
						if(element.menuIsOpen) element.toggleMenu(false, false);
					});
				});
			}
		}
	}
}());
// File#: _1_modal-window
// Usage: codyhouse.co/license
(function() {
	var Modal = function(element) {
		this.element = element;
		this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
		this.firstFocusable = null;
		this.lastFocusable = null;
		this.moveFocusEl = null; // focus will be moved to this element when modal is open
		this.modalFocus = this.element.getAttribute('data-modal-first-focus') ? this.element.querySelector(this.element.getAttribute('data-modal-first-focus')) : null;
		this.selectedTrigger = null;
		this.preventScrollEl = this.getPreventScrollEl();
		this.showClass = "modal--is-visible";
		this.initModal();
	};

	Modal.prototype.getPreventScrollEl = function() {
		var scrollEl = false;
		var querySelector = this.element.getAttribute('data-modal-prevent-scroll');
		if(querySelector) scrollEl = document.querySelector(querySelector);
		return scrollEl;
	};

	Modal.prototype.initModal = function() {
		var self = this;
		//open modal when clicking on trigger buttons
		if ( this.triggers ) {
			for(var i = 0; i < this.triggers.length; i++) {
				this.triggers[i].addEventListener('click', function(event) {
					event.preventDefault();
					if(Util.hasClass(self.element, self.showClass)) {
						self.closeModal();
						return;
					}
					self.selectedTrigger = event.target;
					self.showModal();
					self.initModalEvents();
				});
			}
		}

		// listen to the openModal event -> open modal without a trigger button
		this.element.addEventListener('openModal', function(event){
			if(event.detail) self.selectedTrigger = event.detail;
			self.showModal();
			self.initModalEvents();
		});

		// listen to the closeModal event -> close modal without a trigger button
		this.element.addEventListener('closeModal', function(event){
			if(event.detail) self.selectedTrigger = event.detail;
			self.closeModal();
		});

		// if modal is open by default -> initialise modal events
		if(Util.hasClass(this.element, this.showClass)) this.initModalEvents();
	};

	Modal.prototype.showModal = function() {
		var self = this;
		Util.addClass(this.element, this.showClass);
		this.getFocusableElements();
		if(this.moveFocusEl) {
			this.moveFocusEl.focus();
			// wait for the end of transitions before moving focus
			this.element.addEventListener("transitionend", function cb(event) {
				self.moveFocusEl.focus();
				self.element.removeEventListener("transitionend", cb);
			});
		}
		this.emitModalEvents('modalIsOpen');
		// change the overflow of the preventScrollEl
		if(this.preventScrollEl) this.preventScrollEl.style.overflow = 'hidden';
	};

	Modal.prototype.closeModal = function() {
		if(!Util.hasClass(this.element, this.showClass)) return;
		console.log('close')
		Util.removeClass(this.element, this.showClass);
		this.firstFocusable = null;
		this.lastFocusable = null;
		this.moveFocusEl = null;
		if(this.selectedTrigger) this.selectedTrigger.focus();
		//remove listeners
		this.cancelModalEvents();
		this.emitModalEvents('modalIsClose');
		// change the overflow of the preventScrollEl
		if(this.preventScrollEl) this.preventScrollEl.style.overflow = '';
	};

	Modal.prototype.initModalEvents = function() {
		//add event listeners
		this.element.addEventListener('keydown', this);
		this.element.addEventListener('click', this);
	};

	Modal.prototype.cancelModalEvents = function() {
		//remove event listeners
		this.element.removeEventListener('keydown', this);
		this.element.removeEventListener('click', this);
	};

	Modal.prototype.handleEvent = function (event) {
		switch(event.type) {
			case 'click': {
				this.initClick(event);
			}
			case 'keydown': {
				this.initKeyDown(event);
			}
		}
	};

	Modal.prototype.initKeyDown = function(event) {
		if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
			//trap focus inside modal
			this.trapFocus(event);
		} else if( (event.keyCode && event.keyCode == 13 || event.key && event.key == 'Enter') && event.target.closest('.js-modal__close')) {
			event.preventDefault();
			this.closeModal(); // close modal when pressing Enter on close button
		}	
	};

	Modal.prototype.initClick = function(event) {
		//close modal when clicking on close button or modal bg layer 
		if( !event.target.closest('.js-modal__close') && !Util.hasClass(event.target, 'js-modal') ) return;
		event.preventDefault();
		this.closeModal();
	};

	Modal.prototype.trapFocus = function(event) {
		if( this.firstFocusable == document.activeElement && event.shiftKey) {
			//on Shift+Tab -> focus last focusable element when focus moves out of modal
			event.preventDefault();
			this.lastFocusable.focus();
		}
		if( this.lastFocusable == document.activeElement && !event.shiftKey) {
			//on Tab -> focus first focusable element when focus moves out of modal
			event.preventDefault();
			this.firstFocusable.focus();
		}
	}

	Modal.prototype.getFocusableElements = function() {
		//get all focusable elements inside the modal
		var allFocusable = this.element.querySelectorAll(focusableElString);
		this.getFirstVisible(allFocusable);
		this.getLastVisible(allFocusable);
		this.getFirstFocusable();
	};

	Modal.prototype.getFirstVisible = function(elements) {
		//get first visible focusable element inside the modal
		for(var i = 0; i < elements.length; i++) {
			if( isVisible(elements[i]) ) {
				this.firstFocusable = elements[i];
				break;
			}
		}
	};

	Modal.prototype.getLastVisible = function(elements) {
		//get last visible focusable element inside the modal
		for(var i = elements.length - 1; i >= 0; i--) {
			if( isVisible(elements[i]) ) {
				this.lastFocusable = elements[i];
				break;
			}
		}
	};

	Modal.prototype.getFirstFocusable = function() {
		if(!this.modalFocus || !Element.prototype.matches) {
			this.moveFocusEl = this.firstFocusable;
			return;
		}
		var containerIsFocusable = this.modalFocus.matches(focusableElString);
		if(containerIsFocusable) {
			this.moveFocusEl = this.modalFocus;
		} else {
			this.moveFocusEl = false;
			var elements = this.modalFocus.querySelectorAll(focusableElString);
			for(var i = 0; i < elements.length; i++) {
				if( isVisible(elements[i]) ) {
					this.moveFocusEl = elements[i];
					break;
				}
			}
			if(!this.moveFocusEl) this.moveFocusEl = this.firstFocusable;
		}
	};

	Modal.prototype.emitModalEvents = function(eventName) {
		var event = new CustomEvent(eventName, {detail: this.selectedTrigger});
		this.element.dispatchEvent(event);
	};

	function isVisible(element) {
		return element.offsetWidth || element.offsetHeight || element.getClientRects().length;
	};

	window.Modal = Modal;

	//initialize the Modal objects
	var modals = document.getElementsByClassName('js-modal');
	// generic focusable elements string selector
	var focusableElString = '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary';
	if( modals.length > 0 ) {
		var modalArrays = [];
		for( var i = 0; i < modals.length; i++) {
			(function(i){modalArrays.push(new Modal(modals[i]));})(i);
		}

		window.addEventListener('keydown', function(event){ //close modal window on esc
			if(event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape') {
				for( var i = 0; i < modalArrays.length; i++) {
					(function(i){modalArrays[i].closeModal();})(i);
				};
			}
		});
	}
}());
// File#: _1_notice
// Usage: codyhouse.co/license
(function() {
  function initNoticeEvents(notice) {
    notice.addEventListener('click', function(event){
      if(event.target.closest('.js-notice__hide-control')) {
        event.preventDefault();
        Util.addClass(notice, 'notice--hide');
      }
    });
  };
  
  var noticeElements = document.getElementsByClassName('js-notice');
  if(noticeElements.length > 0) {
    for(var i=0; i < noticeElements.length; i++) {(function(i){
      initNoticeEvents(noticeElements[i]);
    })(i);}
  }
}());
// File#: _1_reading-progressbar
// Usage: codyhouse.co/license
(function() {
  var readingIndicator = document.getElementsByClassName('js-reading-progressbar')[0],
		readingIndicatorContent = document.getElementsByClassName('js-reading-content')[0];
  
  if( readingIndicator && readingIndicatorContent) {
    var progressInfo = [],
      progressEvent = false,
      progressFallback = readingIndicator.getElementsByClassName('js-reading-progressbar__fallback')[0],
      progressIsSupported = 'value' in readingIndicator;

    var boundingClientRect = readingIndicatorContent.getBoundingClientRect();

    progressInfo['height'] = readingIndicatorContent.offsetHeight;
    progressInfo['top'] = boundingClientRect.top;
    progressInfo['bottom'] = boundingClientRect.bottom;
    progressInfo['window'] = window.innerHeight;
    progressInfo['class'] = 'reading-progressbar--is-active';
    progressInfo['hideClass'] = 'reading-progressbar--is-out';
    
    //init indicator
    setProgressIndicator();
    // wait for font to be loaded - reset progress bar
    if(document.fonts) {
      document.fonts.ready.then(function() {
        triggerReset();
      });
    }
    // listen to window resize - update progress
    window.addEventListener('resize', function(event){
      triggerReset();
    });

    //listen to the window scroll event - update progress
    window.addEventListener('scroll', function(event){
      if(progressEvent) return;
      progressEvent = true;
      (!window.requestAnimationFrame) ? setTimeout(function(){setProgressIndicator();}, 250) : window.requestAnimationFrame(setProgressIndicator);
    });
    
    function setProgressIndicator() {
      var boundingClientRect = readingIndicatorContent.getBoundingClientRect();
      progressInfo['top'] = boundingClientRect.top;
      progressInfo['bottom'] = boundingClientRect.bottom;

      if(progressInfo['height'] <= progressInfo['window']) {
        // short content - hide progress indicator
        Util.removeClass(readingIndicator, progressInfo['class']);
        progressEvent = false;
        return;
      }
      // get new progress and update element
      Util.addClass(readingIndicator, progressInfo['class']);
      var value = (progressInfo['top'] >= 0) ? 0 : 100*(0 - progressInfo['top'])/(progressInfo['height'] - progressInfo['window']);
      readingIndicator.setAttribute('value', value);
      if(!progressIsSupported && progressFallback) progressFallback.style.width = value+'%';
      // hide progress bar when target is outside the viewport
      Util.toggleClass(readingIndicator, progressInfo['hideClass'], progressInfo['bottom'] <= 0);
      progressEvent = false;
    };

    function triggerReset() {
      if(progressEvent) return;
      progressEvent = true;
      (!window.requestAnimationFrame) ? setTimeout(function(){resetProgressIndicator();}, 250) : window.requestAnimationFrame(resetProgressIndicator);
    };

    function resetProgressIndicator() {
      progressInfo['height'] = readingIndicatorContent.offsetHeight;
      progressInfo['window'] = window.innerHeight;
      setProgressIndicator();
    };
  }
}());
// File#: _1_reveal-effects
// Usage: codyhouse.co/license
(function() {
	var fxElements = document.getElementsByClassName('reveal-fx');
	var intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
	if(fxElements.length > 0) {
		// deactivate effect if Reduced Motion is enabled
		if (Util.osHasReducedMotion() || !intersectionObserverSupported) {
			fxRemoveClasses();
			return;
		}
		//on small devices, do not animate elements -> reveal all
		if( fxDisabled(fxElements[0]) ) {
			fxRevealAll();
			return;
		}

		var fxRevealDelta = 120; // amount (in pixel) the element needs to enter the viewport to be revealed - if not custom value (data-reveal-fx-delta)
		
		var viewportHeight = window.innerHeight,
			fxChecking = false,
			fxRevealedItems = [],
			fxElementDelays = fxGetDelays(), //elements animation delay
			fxElementDeltas = fxGetDeltas(); // amount (in px) the element needs enter the viewport to be revealed (default value is fxRevealDelta) 
		
		
		// add event listeners
		window.addEventListener('load', fxReveal);
		window.addEventListener('resize', fxResize);
		window.addEventListener('restartAll', fxRestart);

		// observe reveal elements
		var observer = [];
		initObserver();

		function initObserver() {
			for(var i = 0; i < fxElements.length; i++) {
				observer[i] = new IntersectionObserver(
					function(entries, observer) { 
						if(entries[0].isIntersecting) {
							fxRevealItemObserver(entries[0].target);
							observer.unobserve(entries[0].target);
						}
					}, 
					{rootMargin: "0px 0px -"+fxElementDeltas[i]+"px 0px"}
				);
	
				observer[i].observe(fxElements[i]);
			}
		};

		function fxRevealAll() { // reveal all elements - small devices
			for(var i = 0; i < fxElements.length; i++) {
				Util.addClass(fxElements[i], 'reveal-fx--is-visible');
			}
		};

		function fxResize() { // on resize - check new window height and reveal visible elements
			if(fxChecking) return;
			fxChecking = true;
			(!window.requestAnimationFrame) ? setTimeout(function(){fxReset();}, 250) : window.requestAnimationFrame(fxReset);
		};

		function fxReset() {
			viewportHeight = window.innerHeight;
			fxReveal();
		};

		function fxReveal() { // reveal visible elements
			for(var i = 0; i < fxElements.length; i++) {(function(i){
				if(fxRevealedItems.indexOf(i) != -1 ) return; //element has already been revelead
				if(fxElementIsVisible(fxElements[i], i)) {
					fxRevealItem(i);
					fxRevealedItems.push(i);
				}})(i); 
			}
			fxResetEvents(); 
			fxChecking = false;
		};

		function fxRevealItem(index) {
			if(fxElementDelays[index] && fxElementDelays[index] != 0) {
				// wait before revealing element if a delay was added
				setTimeout(function(){
					Util.addClass(fxElements[index], 'reveal-fx--is-visible');
				}, fxElementDelays[index]);
			} else {
				Util.addClass(fxElements[index], 'reveal-fx--is-visible');
			}
		};

		function fxRevealItemObserver(item) {
			var index = Util.getIndexInArray(fxElements, item);
			if(fxRevealedItems.indexOf(index) != -1 ) return; //element has already been revelead
			fxRevealItem(index);
			fxRevealedItems.push(index);
			fxResetEvents(); 
			fxChecking = false;
		};

		function fxGetDelays() { // get anmation delays
			var delays = [];
			for(var i = 0; i < fxElements.length; i++) {
				delays.push( fxElements[i].getAttribute('data-reveal-fx-delay') ? parseInt(fxElements[i].getAttribute('data-reveal-fx-delay')) : 0);
			}
			return delays;
		};

		function fxGetDeltas() { // get reveal delta
			var deltas = [];
			for(var i = 0; i < fxElements.length; i++) {
				deltas.push( fxElements[i].getAttribute('data-reveal-fx-delta') ? parseInt(fxElements[i].getAttribute('data-reveal-fx-delta')) : fxRevealDelta);
			}
			return deltas;
		};

		function fxDisabled(element) { // check if elements need to be animated - no animation on small devices
			return !(window.getComputedStyle(element, '::before').getPropertyValue('content').replace(/'|"/g, "") == 'reveal-fx');
		};

		function fxElementIsVisible(element, i) { // element is inside viewport
			return (fxGetElementPosition(element) <= viewportHeight - fxElementDeltas[i]);
		};

		function fxGetElementPosition(element) { // get top position of element
			return element.getBoundingClientRect().top;
		};

		function fxResetEvents() { 
			if(fxElements.length > fxRevealedItems.length) return;
			// remove event listeners if all elements have been revealed
			window.removeEventListener('load', fxReveal);
			window.removeEventListener('resize', fxResize);
		};

		function fxRemoveClasses() {
			// Reduced Motion on or Intersection Observer not supported
			while(fxElements[0]) {
				// remove all classes starting with 'reveal-fx--'
				var classes = fxElements[0].getAttribute('class').split(" ").filter(function(c) {
					return c.lastIndexOf('reveal-fx--', 0) !== 0;
				});
				fxElements[0].setAttribute('class', classes.join(" ").trim());
				Util.removeClass(fxElements[0], 'reveal-fx');
			}
		};

		function fxRestart() {
      // restart the reveal effect -> hide all elements and re-init the observer
      if (Util.osHasReducedMotion() || !intersectionObserverSupported || fxDisabled(fxElements[0])) {
        return;
      }
      // check if we need to add the event listensers back
      if(fxElements.length <= fxRevealedItems.length) {
        window.addEventListener('load', fxReveal);
        window.addEventListener('resize', fxResize);
      }
      // remove observer and reset the observer array
      for(var i = 0; i < observer.length; i++) {
        if(observer[i]) observer[i].disconnect();
      }
      observer = [];
      // remove visible class
      for(var i = 0; i < fxElements.length; i++) {
        Util.removeClass(fxElements[i], 'reveal-fx--is-visible');
      }
      // reset fxRevealedItems array
      fxRevealedItems = [];
      // restart observer
      initObserver();
    };
	}
}());
// File#: _1_skip-link
// Usage: codyhouse.co/license
(function() {
  function initSkipLinkEvents(skipLink) {
    // toggle class skip-link--focus if link is in focus/loses focus
    skipLink.addEventListener('focusin', function(){
      Util.addClass(skipLink, 'skip-link--focus');
    });
    skipLink.addEventListener('focusout', function(){
      Util.removeClass(skipLink, 'skip-link--focus');
    });
  };

  var skipLinks = document.getElementsByClassName('skip-link');
	if( skipLinks.length > 0 ) {
		for( var i = 0; i < skipLinks.length; i++) {
			initSkipLinkEvents(skipLinks[i]);
		}
  }
}());
// File#: _1_social-sharing
// Usage: codyhouse.co/license
(function() {
  function initSocialShare(button) {
    button.addEventListener('click', function(event){
      event.preventDefault();
      var social = button.getAttribute('data-social');
      var url = getSocialUrl(button, social);
      (social == 'mail')
        ? window.location.href = url
        : window.open(url, social+'-share-dialog', 'width=626,height=436');
    });
  };

  function getSocialUrl(button, social) {
    var params = getSocialParams(social);
    var newUrl = '';
    for(var i = 0; i < params.length; i++) {
      var paramValue = button.getAttribute('data-'+params[i]);
      if(params[i] == 'hashtags') paramValue = encodeURI(paramValue.replace(/\#| /g, ''));
      if(paramValue) {
        (social == 'facebook') 
          ? newUrl = newUrl + 'u='+encodeURIComponent(paramValue)+'&'
          : newUrl = newUrl + params[i]+'='+encodeURIComponent(paramValue)+'&';
      }
    }
    if(social == 'linkedin') newUrl = 'mini=true&'+newUrl;
    return button.getAttribute('href')+'?'+newUrl;
  };

  function getSocialParams(social) {
    var params = [];
    switch (social) {
      case 'twitter':
        params = ['text', 'hashtags'];
        break;
      case 'facebook':
      case 'linkedin':
        params = ['url'];
        break;
      case 'pinterest':
        params = ['url', 'media', 'description'];
        break;
      case 'mail':
        params = ['subject', 'body'];
        break;
    }
    return params;
  };

  var socialShare = document.getElementsByClassName('js-social-share');
  if(socialShare.length > 0) {
    for( var i = 0; i < socialShare.length; i++) {
      (function(i){initSocialShare(socialShare[i])})(i);
    }
  }
}());
// File#: _1_sticky-hero
// Usage: codyhouse.co/license
(function() {
	var StickyBackground = function(element) {
		this.element = element;
		this.scrollingElement = this.element.getElementsByClassName('sticky-hero__content')[0];
		this.nextElement = this.element.nextElementSibling;
		this.scrollingTreshold = 0;
		this.nextTreshold = 0;
		initStickyEffect(this);
	};

	function initStickyEffect(element) {
		var observer = new IntersectionObserver(stickyCallback.bind(element), { threshold: [0, 0.1, 1] });
		observer.observe(element.scrollingElement);
		if(element.nextElement) observer.observe(element.nextElement);
	};

	function stickyCallback(entries, observer) {
		var threshold = entries[0].intersectionRatio.toFixed(1);
		(entries[0].target ==  this.scrollingElement)
			? this.scrollingTreshold = threshold
			: this.nextTreshold = threshold;

		Util.toggleClass(this.element, 'sticky-hero--media-is-fixed', (this.nextTreshold > 0 || this.scrollingTreshold > 0));
	};


	var stickyBackground = document.getElementsByClassName('js-sticky-hero'),
		intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
	if(stickyBackground.length > 0 && intersectionObserverSupported) { // if IntersectionObserver is not supported, animations won't be triggeres
		for(var i = 0; i < stickyBackground.length; i++) {
			(function(i){ // if animations are enabled -> init the StickyBackground object
        if( Util.hasClass(stickyBackground[i], 'sticky-hero--overlay-layer') || Util.hasClass(stickyBackground[i], 'sticky-hero--scale')) new StickyBackground(stickyBackground[i]);
      })(i);
		}
	}
}());
// File#: _1_swipe-content
(function() {
	var SwipeContent = function(element) {
		this.element = element;
		this.delta = [false, false];
		this.dragging = false;
		this.intervalId = false;
		initSwipeContent(this);
	};

	function initSwipeContent(content) {
		content.element.addEventListener('mousedown', handleEvent.bind(content));
		content.element.addEventListener('touchstart', handleEvent.bind(content));
	};

	function initDragging(content) {
		//add event listeners
		content.element.addEventListener('mousemove', handleEvent.bind(content));
		content.element.addEventListener('touchmove', handleEvent.bind(content));
		content.element.addEventListener('mouseup', handleEvent.bind(content));
		content.element.addEventListener('mouseleave', handleEvent.bind(content));
		content.element.addEventListener('touchend', handleEvent.bind(content));
	};

	function cancelDragging(content) {
		//remove event listeners
		if(content.intervalId) {
			(!window.requestAnimationFrame) ? clearInterval(content.intervalId) : window.cancelAnimationFrame(content.intervalId);
			content.intervalId = false;
		}
		content.element.removeEventListener('mousemove', handleEvent.bind(content));
		content.element.removeEventListener('touchmove', handleEvent.bind(content));
		content.element.removeEventListener('mouseup', handleEvent.bind(content));
		content.element.removeEventListener('mouseleave', handleEvent.bind(content));
		content.element.removeEventListener('touchend', handleEvent.bind(content));
	};

	function handleEvent(event) {
		switch(event.type) {
			case 'mousedown':
			case 'touchstart':
				startDrag(this, event);
				break;
			case 'mousemove':
			case 'touchmove':
				drag(this, event);
				break;
			case 'mouseup':
			case 'mouseleave':
			case 'touchend':
				endDrag(this, event);
				break;
		}
	};

	function startDrag(content, event) {
		content.dragging = true;
		// listen to drag movements
		initDragging(content);
		content.delta = [parseInt(unify(event).clientX), parseInt(unify(event).clientY)];
		// emit drag start event
		emitSwipeEvents(content, 'dragStart', content.delta, event.target);
	};

	function endDrag(content, event) {
		cancelDragging(content);
		// credits: https://css-tricks.com/simple-swipe-with-vanilla-javascript/
		var dx = parseInt(unify(event).clientX), 
	    dy = parseInt(unify(event).clientY);
	  
	  // check if there was a left/right swipe
		if(content.delta && (content.delta[0] || content.delta[0] === 0)) {
	    var s = getSign(dx - content.delta[0]);
			
			if(Math.abs(dx - content.delta[0]) > 30) {
				(s < 0) ? emitSwipeEvents(content, 'swipeLeft', [dx, dy]) : emitSwipeEvents(content, 'swipeRight', [dx, dy]);	
			}
	    
	    content.delta[0] = false;
	  }
		// check if there was a top/bottom swipe
	  if(content.delta && (content.delta[1] || content.delta[1] === 0)) {
	  	var y = getSign(dy - content.delta[1]);

	  	if(Math.abs(dy - content.delta[1]) > 30) {
	    	(y < 0) ? emitSwipeEvents(content, 'swipeUp', [dx, dy]) : emitSwipeEvents(content, 'swipeDown', [dx, dy]);
	    }

	    content.delta[1] = false;
	  }
		// emit drag end event
	  emitSwipeEvents(content, 'dragEnd', [dx, dy]);
	  content.dragging = false;
	};

	function drag(content, event) {
		if(!content.dragging) return;
		// emit dragging event with coordinates
		(!window.requestAnimationFrame) 
			? content.intervalId = setTimeout(function(){emitDrag.bind(content, event);}, 250) 
			: content.intervalId = window.requestAnimationFrame(emitDrag.bind(content, event));
	};

	function emitDrag(event) {
		emitSwipeEvents(this, 'dragging', [parseInt(unify(event).clientX), parseInt(unify(event).clientY)]);
	};

	function unify(event) { 
		// unify mouse and touch events
		return event.changedTouches ? event.changedTouches[0] : event; 
	};

	function emitSwipeEvents(content, eventName, detail, el) {
		var trigger = false;
		if(el) trigger = el;
		// emit event with coordinates
		var event = new CustomEvent(eventName, {detail: {x: detail[0], y: detail[1], origin: trigger}});
		content.element.dispatchEvent(event);
	};

	function getSign(x) {
		if(!Math.sign) {
			return ((x > 0) - (x < 0)) || +x;
		} else {
			return Math.sign(x);
		}
	};

	window.SwipeContent = SwipeContent;
	
	//initialize the SwipeContent objects
	var swipe = document.getElementsByClassName('js-swipe-content');
	if( swipe.length > 0 ) {
		for( var i = 0; i < swipe.length; i++) {
			(function(i){new SwipeContent(swipe[i]);})(i);
		}
	}
}());
// File#: _1_tabs
// Usage: codyhouse.co/license
(function() {
	var Tab = function(element) {
		this.element = element;
		this.tabList = this.element.getElementsByClassName('js-tabs__controls')[0];
		this.listItems = this.tabList.getElementsByTagName('li');
		this.triggers = this.tabList.getElementsByTagName('a');
		this.panelsList = this.element.getElementsByClassName('js-tabs__panels')[0];
		this.panels = Util.getChildrenByClassName(this.panelsList, 'js-tabs__panel');
		this.hideClass = 'is-hidden';
		this.customShowClass = this.element.getAttribute('data-show-panel-class') ? this.element.getAttribute('data-show-panel-class') : false;
		this.layout = this.element.getAttribute('data-tabs-layout') ? this.element.getAttribute('data-tabs-layout') : 'horizontal';
		// deep linking options
		this.deepLinkOn = this.element.getAttribute('data-deep-link') == 'on';
		// init tabs
		this.initTab();
	};

	Tab.prototype.initTab = function() {
		//set initial aria attributes
		this.tabList.setAttribute('role', 'tablist');
		for( var i = 0; i < this.triggers.length; i++) {
			var bool = (i == 0),
				panelId = this.panels[i].getAttribute('id');
			this.listItems[i].setAttribute('role', 'presentation');
			Util.setAttributes(this.triggers[i], {'role': 'tab', 'aria-selected': bool, 'aria-controls': panelId, 'id': 'tab-'+panelId});
			Util.addClass(this.triggers[i], 'js-tabs__trigger'); 
			Util.setAttributes(this.panels[i], {'role': 'tabpanel', 'aria-labelledby': 'tab-'+panelId});
			Util.toggleClass(this.panels[i], this.hideClass, !bool);

			if(!bool) this.triggers[i].setAttribute('tabindex', '-1'); 
		}

		//listen for Tab events
		this.initTabEvents();

		// check deep linking option
		this.initDeepLink();
	};

	Tab.prototype.initTabEvents = function() {
		var self = this;
		//click on a new tab -> select content
		this.tabList.addEventListener('click', function(event) {
			if( event.target.closest('.js-tabs__trigger') ) self.triggerTab(event.target.closest('.js-tabs__trigger'), event);
		});
		//arrow keys to navigate through tabs 
		this.tabList.addEventListener('keydown', function(event) {
			;
			if( !event.target.closest('.js-tabs__trigger') ) return;
			if( tabNavigateNext(event, self.layout) ) {
				event.preventDefault();
				self.selectNewTab('next');
			} else if( tabNavigatePrev(event, self.layout) ) {
				event.preventDefault();
				self.selectNewTab('prev');
			}
		});
	};

	Tab.prototype.selectNewTab = function(direction) {
		var selectedTab = this.tabList.querySelector('[aria-selected="true"]'),
			index = Util.getIndexInArray(this.triggers, selectedTab);
		index = (direction == 'next') ? index + 1 : index - 1;
		//make sure index is in the correct interval 
		//-> from last element go to first using the right arrow, from first element go to last using the left arrow
		if(index < 0) index = this.listItems.length - 1;
		if(index >= this.listItems.length) index = 0;	
		this.triggerTab(this.triggers[index]);
		this.triggers[index].focus();
	};

	Tab.prototype.triggerTab = function(tabTrigger, event) {
		var self = this;
		event && event.preventDefault();	
		var index = Util.getIndexInArray(this.triggers, tabTrigger);
		//no need to do anything if tab was already selected
		if(this.triggers[index].getAttribute('aria-selected') == 'true') return;
		
		for( var i = 0; i < this.triggers.length; i++) {
			var bool = (i == index);
			Util.toggleClass(this.panels[i], this.hideClass, !bool);
			if(this.customShowClass) Util.toggleClass(this.panels[i], this.customShowClass, bool);
			this.triggers[i].setAttribute('aria-selected', bool);
			bool ? this.triggers[i].setAttribute('tabindex', '0') : this.triggers[i].setAttribute('tabindex', '-1');
		}

		// update url if deepLink is on
		if(this.deepLinkOn) {
			history.replaceState(null, '', '#'+tabTrigger.getAttribute('aria-controls'));
		}
	};

	Tab.prototype.initDeepLink = function() {
		if(!this.deepLinkOn) return;
		var hash = window.location.hash.substr(1);
		var self = this;
		if(!hash || hash == '') return;
		for(var i = 0; i < this.panels.length; i++) {
			if(this.panels[i].getAttribute('id') == hash) {
				this.triggerTab(this.triggers[i], false);
				setTimeout(function(){self.panels[i].scrollIntoView(true);});
				break;
			}
		};
	};

	function tabNavigateNext(event, layout) {
		if(layout == 'horizontal' && (event.keyCode && event.keyCode == 39 || event.key && event.key == 'ArrowRight')) {return true;}
		else if(layout == 'vertical' && (event.keyCode && event.keyCode == 40 || event.key && event.key == 'ArrowDown')) {return true;}
		else {return false;}
	};

	function tabNavigatePrev(event, layout) {
		if(layout == 'horizontal' && (event.keyCode && event.keyCode == 37 || event.key && event.key == 'ArrowLeft')) {return true;}
		else if(layout == 'vertical' && (event.keyCode && event.keyCode == 38 || event.key && event.key == 'ArrowUp')) {return true;}
		else {return false;}
	};
	
	//initialize the Tab objects
	var tabs = document.getElementsByClassName('js-tabs');
	if( tabs.length > 0 ) {
		for( var i = 0; i < tabs.length; i++) {
			(function(i){new Tab(tabs[i]);})(i);
		}
	}
}());
// File#: _1_vertical-timeline
// Usage: codyhouse.co/license
(function() {
	var VTimeline = function(element) {
    this.element = element;
    this.sections = this.element.getElementsByClassName('js-v-timeline__section');
    this.animate = this.element.getAttribute('data-animation') && this.element.getAttribute('data-animation') == 'on' ? true : false;
    this.animationClass = 'v-timeline__section--animate';
    this.animationDelta = '-150px';
    initVTimeline(this);
  };

  function initVTimeline(element) {
    if(!element.animate) return;
    for(var i = 0; i < element.sections.length; i++) {
      var observer = new IntersectionObserver(vTimelineCallback.bind(element, i),
      {rootMargin: "0px 0px "+element.animationDelta+" 0px"});
		  observer.observe(element.sections[i]);
    }
  };

  function vTimelineCallback(index, entries, observer) {
    if(entries[0].isIntersecting) {
      Util.addClass(this.sections[index], this.animationClass);
      observer.unobserve(this.sections[index]);
    } 
  };

  //initialize the VTimeline objects
  var timelines = document.querySelectorAll('.js-v-timeline'),
    intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype),
    reducedMotion = Util.osHasReducedMotion();
	if( timelines.length > 0) {
		for( var i = 0; i < timelines.length; i++) {
      if(intersectionObserverSupported && !reducedMotion) (function(i){new VTimeline(timelines[i]);})(i);
      else timelines[i].removeAttribute('data-animation');
		}
	}
}());
// File#: _2_flexi-header
// Usage: codyhouse.co/license
(function() {
  var flexHeader = document.getElementsByClassName('js-f-header');
	if(flexHeader.length > 0) {
		var menuTrigger = flexHeader[0].getElementsByClassName('js-anim-menu-btn')[0],
			firstFocusableElement = getMenuFirstFocusable();

		// we'll use these to store the node that needs to receive focus when the mobile menu is closed 
		var focusMenu = false;

		resetFlexHeaderOffset();
		setAriaButtons();

		menuTrigger.addEventListener('anim-menu-btn-clicked', function(event){
			toggleMenuNavigation(event.detail);
		});

		// listen for key events
		window.addEventListener('keyup', function(event){
			// listen for esc key
			if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) {
				// close navigation on mobile if open
				if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger)) {
					focusMenu = menuTrigger; // move focus to menu trigger when menu is close
					menuTrigger.click();
				}
			}
			// listen for tab key
			if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) {
				// close navigation on mobile if open when nav loses focus
				if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger) && !document.activeElement.closest('.js-f-header')) menuTrigger.click();
			}
		});

		// detect click on a dropdown control button - expand-on-mobile only
		flexHeader[0].addEventListener('click', function(event){
			var btnLink = event.target.closest('.js-f-header__dropdown-control');
			if(!btnLink) return;
			!btnLink.getAttribute('aria-expanded') ? btnLink.setAttribute('aria-expanded', 'true') : btnLink.removeAttribute('aria-expanded');
		});

		// detect mouseout from a dropdown control button - expand-on-mobile only
		flexHeader[0].addEventListener('mouseout', function(event){
			var btnLink = event.target.closest('.js-f-header__dropdown-control');
			if(!btnLink) return;
			// check layout type
			if(getLayout() == 'mobile') return;
			btnLink.removeAttribute('aria-expanded');
		});

		// close dropdown on focusout - expand-on-mobile only
		flexHeader[0].addEventListener('focusin', function(event){
			var btnLink = event.target.closest('.js-f-header__dropdown-control'),
				dropdown = event.target.closest('.f-header__dropdown');
			if(dropdown) return;
			if(btnLink && btnLink.hasAttribute('aria-expanded')) return;
			// check layout type
			if(getLayout() == 'mobile') return;
			var openDropdown = flexHeader[0].querySelector('.js-f-header__dropdown-control[aria-expanded="true"]');
			if(openDropdown) openDropdown.removeAttribute('aria-expanded');
		});

		// listen for resize
		var resizingId = false;
		window.addEventListener('resize', function() {
			clearTimeout(resizingId);
			resizingId = setTimeout(doneResizing, 500);
		});

		function getMenuFirstFocusable() {
			var focusableEle = flexHeader[0].getElementsByClassName('f-header__nav')[0].querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary'),
				firstFocusable = false;
			for(var i = 0; i < focusableEle.length; i++) {
				if( focusableEle[i].offsetWidth || focusableEle[i].offsetHeight || focusableEle[i].getClientRects().length ) {
					firstFocusable = focusableEle[i];
					break;
				}
			}

			return firstFocusable;
    };
    
    function isVisible(element) {
      return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
		};

		function doneResizing() {
			if( !isVisible(menuTrigger) && Util.hasClass(flexHeader[0], 'f-header--expanded')) {
				menuTrigger.click();
			}
			resetFlexHeaderOffset();
		};
		
		function toggleMenuNavigation(bool) { // toggle menu visibility on small devices
			Util.toggleClass(document.getElementsByClassName('f-header__nav')[0], 'f-header__nav--is-visible', bool);
			Util.toggleClass(flexHeader[0], 'f-header--expanded', bool);
			menuTrigger.setAttribute('aria-expanded', bool);
			if(bool) firstFocusableElement.focus(); // move focus to first focusable element
			else if(focusMenu) {
				focusMenu.focus();
				focusMenu = false;
			}
		};

		function resetFlexHeaderOffset() {
			// on mobile -> update max height of the flexi header based on its offset value (e.g., if there's a fixed pre-header element)
			document.documentElement.style.setProperty('--f-header-offset', flexHeader[0].getBoundingClientRect().top+'px');
		};

		function setAriaButtons() {
			var btnDropdown = flexHeader[0].getElementsByClassName('js-f-header__dropdown-control');
			for(var i = 0; i < btnDropdown.length; i++) {
				var id = 'f-header-dropdown-'+i,
					dropdown = btnDropdown[i].nextElementSibling;
				if(dropdown.hasAttribute('id')) {
					id = dropdown.getAttribute('id');
				} else {
					dropdown.setAttribute('id', id);
				}
				btnDropdown[i].setAttribute('aria-controls', id);	
			}
		};

		function getLayout() {
			return getComputedStyle(flexHeader[0], ':before').getPropertyValue('content').replace(/\'|"/g, '');
		};
	}
}());
// File#: _2_points-of-interest
// Usage: codyhouse.co/license
(function() {
  function initPoi(element) {
    element.addEventListener('click', function(event){
      var poiItem = event.target.closest('.js-poi__item');
      if(poiItem) Util.addClass(poiItem, 'poi__item--visited');
    });
  };

  var poi = document.getElementsByClassName('js-poi');
  for(var i = 0; i < poi.length; i++) {
    (function(i){initPoi(poi[i]);})(i);
  }
}());
// File#: _2_menu-bar
// Usage: codyhouse.co/license
(function() {
  var MenuBar = function(element) {
    this.element = element;
    this.items = Util.getChildrenByClassName(this.element, 'menu-bar__item');
    this.mobHideItems = this.element.getElementsByClassName('menu-bar__item--hide');
    this.moreItemsTrigger = this.element.getElementsByClassName('js-menu-bar__trigger');
    initMenuBar(this);
  };

  function initMenuBar(menu) {
    setMenuTabIndex(menu); // set correct tabindexes for menu item
    initMenuBarMarkup(menu); // create additional markup
    checkMenuLayout(menu); // set menu layout
    Util.addClass(menu.element, 'menu-bar--loaded'); // reveal menu

    // custom event emitted when window is resized
    menu.element.addEventListener('update-menu-bar', function(event){
      checkMenuLayout(menu);
      if(menu.menuInstance) menu.menuInstance.toggleMenu(false, false); // close dropdown
    });

    // keyboard events 
    // open dropdown when pressing Enter on trigger element
    if(menu.moreItemsTrigger.length > 0) {
      menu.moreItemsTrigger[0].addEventListener('keydown', function(event) {
        if( (event.keyCode && event.keyCode == 13) || (event.key && event.key.toLowerCase() == 'enter') ) {
          if(!menu.menuInstance) return;
          menu.menuInstance.selectedTrigger = menu.moreItemsTrigger[0];
          menu.menuInstance.toggleMenu(!Util.hasClass(menu.subMenu, 'menu--is-visible'), true);
        }
      });

      // close dropdown on esc
      menu.subMenu.addEventListener('keydown', function(event) {
        if((event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape')) { // close submenu on esc
          if(menu.menuInstance) menu.menuInstance.toggleMenu(false, true);
        }
      });
    }
    
    // navigate menu items using left/right arrows
    menu.element.addEventListener('keydown', function(event) {
      if( (event.keyCode && event.keyCode == 39) || (event.key && event.key.toLowerCase() == 'arrowright') ) {
        navigateItems(menu.items, event, 'next');
      } else if( (event.keyCode && event.keyCode == 37) || (event.key && event.key.toLowerCase() == 'arrowleft') ) {
        navigateItems(menu.items, event, 'prev');
      }
    });
  };

  function setMenuTabIndex(menu) { // set tabindexes for the menu items to allow keyboard navigation
    var nextItem = false;
    for(var i = 0; i < menu.items.length; i++ ) {
      if(i == 0 || nextItem) menu.items[i].setAttribute('tabindex', '0');
      else menu.items[i].setAttribute('tabindex', '-1');
      if(i == 0 && menu.moreItemsTrigger.length > 0) nextItem = true;
      else nextItem = false;
    }
  };

  function initMenuBarMarkup(menu) {
    if(menu.mobHideItems.length == 0 ) { // no items to hide on mobile - remove trigger
      if(menu.moreItemsTrigger.length > 0) menu.element.removeChild(menu.moreItemsTrigger[0]);
      return;
    }

    if(menu.moreItemsTrigger.length == 0) return;

    // create the markup for the Menu element
    var content = '';
    menu.menuControlId = 'submenu-bar-'+Date.now();
    for(var i = 0; i < menu.mobHideItems.length; i++) {
      var item = menu.mobHideItems[i].cloneNode(true),
        svg = item.getElementsByTagName('svg')[0],
        label = item.getElementsByClassName('menu-bar__label')[0];

      svg.setAttribute('class', 'icon menu__icon');
      content = content + '<li role="menuitem"><span class="menu__content js-menu__content">'+svg.outerHTML+'<span>'+label.innerHTML+'</span></span></li>';
    }

    Util.setAttributes(menu.moreItemsTrigger[0], {'role': 'button', 'aria-expanded': 'false', 'aria-controls': menu.menuControlId, 'aria-haspopup': 'true'});

    var subMenu = document.createElement('menu'),
      customClass = menu.element.getAttribute('data-menu-class');
    Util.setAttributes(subMenu, {'id': menu.menuControlId, 'class': 'menu js-menu '+customClass});
    subMenu.innerHTML = content;
    document.body.appendChild(subMenu);

    menu.subMenu = subMenu;
    menu.subItems = subMenu.getElementsByTagName('li');

    menu.menuInstance = new Menu(menu.subMenu); // this will handle the dropdown behaviour
  };

  function checkMenuLayout(menu) { // switch from compressed to expanded layout and viceversa
    var layout = getComputedStyle(menu.element, ':before').getPropertyValue('content').replace(/\'|"/g, '');
    Util.toggleClass(menu.element, 'menu-bar--collapsed', layout == 'collapsed');
  };

  function navigateItems(list, event, direction, prevIndex) { // keyboard navigation among menu items
    event.preventDefault();
    var index = (typeof prevIndex !== 'undefined') ? prevIndex : Util.getIndexInArray(list, event.target),
      nextIndex = direction == 'next' ? index + 1 : index - 1;
    if(nextIndex < 0) nextIndex = list.length - 1;
    if(nextIndex > list.length - 1) nextIndex = 0;
    // check if element is visible before moving focus
    (list[nextIndex].offsetParent === null) ? navigateItems(list, event, direction, nextIndex) : Util.moveFocus(list[nextIndex]);
  };

  function checkMenuClick(menu, target) { // close dropdown when clicking outside the menu element
    if(menu.menuInstance && !menu.moreItemsTrigger[0].contains(target) && !menu.subMenu.contains(target)) menu.menuInstance.toggleMenu(false, false);
  };

  // init MenuBars objects
  var menuBars = document.getElementsByClassName('js-menu-bar');
  if( menuBars.length > 0 ) {
    var j = 0,
      menuBarArray = [];
    for( var i = 0; i < menuBars.length; i++) {
      var beforeContent = getComputedStyle(menuBars[i], ':before').getPropertyValue('content');
      if(beforeContent && beforeContent !='' && beforeContent !='none') {
        (function(i){menuBarArray.push(new MenuBar(menuBars[i]));})(i);
        j = j + 1;
      }
    }
    
    if(j > 0) {
      var resizingId = false,
        customEvent = new CustomEvent('update-menu-bar');
      // update Menu Bar layout on resize  
      window.addEventListener('resize', function(event){
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 150);
      });

      // close menu when clicking outside it
      window.addEventListener('click', function(event){
        menuBarArray.forEach(function(element){
          checkMenuClick(element, event.target);
        });
      });

      function doneResizing() {
        for( var i = 0; i < menuBars.length; i++) {
          (function(i){menuBars[i].dispatchEvent(customEvent)})(i);
        };
      };
    }
  }
}());
// File#: _2_pricing-table
// Usage: codyhouse.co/license
(function() {
	// NOTE: you need the js code only when using the --has-switch variation of the pricing table
	// default version does not require js
	var pTable = document.getElementsByClassName('js-p-table--has-switch');
	if(pTable.length > 0) {
		for(var i = 0; i < pTable.length; i++) {
			(function(i){ addPTableEvent(pTable[i]);})(i);
		}

		function addPTableEvent(element) {
			var pSwitch = element.getElementsByClassName('js-p-table__switch')[0];
			if(pSwitch) {
				pSwitch.addEventListener('change', function(event) {
          Util.toggleClass(element, 'p-table--yearly', (event.target.value == 'yearly'));
				});
			}
		}
	}
}());
// File#: _2_slideshow
// Usage: codyhouse.co/license
(function() {
	var Slideshow = function(opts) {
		this.options = Util.extend(Slideshow.defaults , opts);
		this.element = this.options.element;
		this.items = this.element.getElementsByClassName('js-slideshow__item');
		this.controls = this.element.getElementsByClassName('js-slideshow__control'); 
		this.selectedSlide = 0;
		this.autoplayId = false;
		this.autoplayPaused = false;
		this.navigation = false;
		this.navCurrentLabel = false;
		this.ariaLive = false;
		this.moveFocus = false;
		this.animating = false;
		this.supportAnimation = Util.cssSupports('transition');
		this.animationOff = (!Util.hasClass(this.element, 'slideshow--transition-fade') && !Util.hasClass(this.element, 'slideshow--transition-slide') && !Util.hasClass(this.element, 'slideshow--transition-prx'));
		this.animationType = Util.hasClass(this.element, 'slideshow--transition-prx') ? 'prx' : 'slide';
		this.animatingClass = 'slideshow--is-animating';
		initSlideshow(this);
		initSlideshowEvents(this);
		initAnimationEndEvents(this);
	};

	Slideshow.prototype.showNext = function() {
		showNewItem(this, this.selectedSlide + 1, 'next');
	};

	Slideshow.prototype.showPrev = function() {
		showNewItem(this, this.selectedSlide - 1, 'prev');
	};

	Slideshow.prototype.showItem = function(index) {
		showNewItem(this, index, false);
	};

	Slideshow.prototype.startAutoplay = function() {
		var self = this;
		if(this.options.autoplay && !this.autoplayId && !this.autoplayPaused) {
			self.autoplayId = setInterval(function(){
				self.showNext();
			}, self.options.autoplayInterval);
		}
	};

	Slideshow.prototype.pauseAutoplay = function() {
		var self = this;
		if(this.options.autoplay) {
			clearInterval(self.autoplayId);
			self.autoplayId = false;
		}
	};

	function initSlideshow(slideshow) { // basic slideshow settings
		// if no slide has been selected -> select the first one
		if(slideshow.element.getElementsByClassName('slideshow__item--selected').length < 1) Util.addClass(slideshow.items[0], 'slideshow__item--selected');
		slideshow.selectedSlide = Util.getIndexInArray(slideshow.items, slideshow.element.getElementsByClassName('slideshow__item--selected')[0]);
		// create an element that will be used to announce the new visible slide to SR
		var srLiveArea = document.createElement('div');
		Util.setAttributes(srLiveArea, {'class': 'sr-only js-slideshow__aria-live', 'aria-live': 'polite', 'aria-atomic': 'true'});
		slideshow.element.appendChild(srLiveArea);
		slideshow.ariaLive = srLiveArea;
	};

	function initSlideshowEvents(slideshow) {
		// if slideshow navigation is on -> create navigation HTML and add event listeners
		if(slideshow.options.navigation) {
			// check if navigation has already been included
			if(slideshow.element.getElementsByClassName('js-slideshow__navigation').length == 0) {
				var navigation = document.createElement('ol'),
					navChildren = '';

				var navClasses = 'slideshow__navigation js-slideshow__navigation';
				if(slideshow.items.length <= 1) {
					navClasses = navClasses + ' is-hidden';
				} 
				
				navigation.setAttribute('class', navClasses);
				for(var i = 0; i < slideshow.items.length; i++) {
					var className = (i == slideshow.selectedSlide) ? 'class="slideshow__nav-item slideshow__nav-item--selected js-slideshow__nav-item"' :  'class="slideshow__nav-item js-slideshow__nav-item"',
						navCurrentLabel = (i == slideshow.selectedSlide) ? '<span class="sr-only js-slideshow__nav-current-label">Current Item</span>' : '';
					navChildren = navChildren + '<li '+className+'><button class="reset"><span class="sr-only">'+ (i+1) + '</span>'+navCurrentLabel+'</button></li>';
				}
				navigation.innerHTML = navChildren;
				slideshow.element.appendChild(navigation);
			}
			
			slideshow.navCurrentLabel = slideshow.element.getElementsByClassName('js-slideshow__nav-current-label')[0]; 
			slideshow.navigation = slideshow.element.getElementsByClassName('js-slideshow__nav-item');

			var dotsNavigation = slideshow.element.getElementsByClassName('js-slideshow__navigation')[0];

			dotsNavigation.addEventListener('click', function(event){
				navigateSlide(slideshow, event, true);
			});
			dotsNavigation.addEventListener('keyup', function(event){
				navigateSlide(slideshow, event, (event.key.toLowerCase() == 'enter'));
			});
		}
		// slideshow arrow controls
		if(slideshow.controls.length > 0) {
			// hide controls if one item available
			if(slideshow.items.length <= 1) {
				Util.addClass(slideshow.controls[0], 'is-hidden');
				Util.addClass(slideshow.controls[1], 'is-hidden');
			}
			slideshow.controls[0].addEventListener('click', function(event){
				event.preventDefault();
				slideshow.showPrev();
				updateAriaLive(slideshow);
			});
			slideshow.controls[1].addEventListener('click', function(event){
				event.preventDefault();
				slideshow.showNext();
				updateAriaLive(slideshow);
			});
		}
		// swipe events
		if(slideshow.options.swipe) {
			//init swipe
			new SwipeContent(slideshow.element);
			slideshow.element.addEventListener('swipeLeft', function(event){
				slideshow.showNext();
			});
			slideshow.element.addEventListener('swipeRight', function(event){
				slideshow.showPrev();
			});
		}
		// autoplay
		if(slideshow.options.autoplay) {
			slideshow.startAutoplay();
			// pause autoplay if user is interacting with the slideshow
			if(!slideshow.options.autoplayOnHover) {
				slideshow.element.addEventListener('mouseenter', function(event){
					slideshow.pauseAutoplay();
					slideshow.autoplayPaused = true;
				});
				slideshow.element.addEventListener('mouseleave', function(event){
					slideshow.autoplayPaused = false;
					slideshow.startAutoplay();
				});
			}
			
			slideshow.element.addEventListener('focusin', function(event){
				slideshow.pauseAutoplay();
				slideshow.autoplayPaused = true;
			});
			slideshow.element.addEventListener('focusout', function(event){
				slideshow.autoplayPaused = false;
				slideshow.startAutoplay();
			});
		}
		// detect if external buttons control the slideshow
		var slideshowId = slideshow.element.getAttribute('id');
		if(slideshowId) {
			var externalControls = document.querySelectorAll('[data-controls="'+slideshowId+'"]');
			for(var i = 0; i < externalControls.length; i++) {
				(function(i){externalControlSlide(slideshow, externalControls[i]);})(i);
			}
		}
		// custom event to trigger selection of a new slide element
		slideshow.element.addEventListener('selectNewItem', function(event){
			// check if slide is already selected
			if(event.detail) {
				if(event.detail - 1 == slideshow.selectedSlide) return;
				showNewItem(slideshow, event.detail - 1, false);
			}
		});

		// keyboard navigation
		slideshow.element.addEventListener('keydown', function(event){
			if(event.keyCode && event.keyCode == 39 || event.key && event.key.toLowerCase() == 'arrowright') {
				slideshow.showNext();
			} else if(event.keyCode && event.keyCode == 37 || event.key && event.key.toLowerCase() == 'arrowleft') {
				slideshow.showPrev();
			}
		});
	};

	function navigateSlide(slideshow, event, keyNav) { 
		// user has interacted with the slideshow navigation -> update visible slide
		var target = ( Util.hasClass(event.target, 'js-slideshow__nav-item') ) ? event.target : event.target.closest('.js-slideshow__nav-item');
		if(keyNav && target && !Util.hasClass(target, 'slideshow__nav-item--selected')) {
			slideshow.showItem(Util.getIndexInArray(slideshow.navigation, target));
			slideshow.moveFocus = true;
			updateAriaLive(slideshow);
		}
	};

	function initAnimationEndEvents(slideshow) {
		// remove animation classes at the end of a slide transition
		for( var i = 0; i < slideshow.items.length; i++) {
			(function(i){
				slideshow.items[i].addEventListener('animationend', function(){resetAnimationEnd(slideshow, slideshow.items[i]);});
				slideshow.items[i].addEventListener('transitionend', function(){resetAnimationEnd(slideshow, slideshow.items[i]);});
			})(i);
		}
	};

	function resetAnimationEnd(slideshow, item) {
		setTimeout(function(){ // add a delay between the end of animation and slideshow reset - improve animation performance
			if(Util.hasClass(item,'slideshow__item--selected')) {
				if(slideshow.moveFocus) Util.moveFocus(item);
				emitSlideshowEvent(slideshow, 'newItemVisible', slideshow.selectedSlide);
				slideshow.moveFocus = false;
			}
			Util.removeClass(item, 'slideshow__item--'+slideshow.animationType+'-out-left slideshow__item--'+slideshow.animationType+'-out-right slideshow__item--'+slideshow.animationType+'-in-left slideshow__item--'+slideshow.animationType+'-in-right');
			item.removeAttribute('aria-hidden');
			slideshow.animating = false;
			Util.removeClass(slideshow.element, slideshow.animatingClass); 
		}, 100);
	};

	function showNewItem(slideshow, index, bool) {
		if(slideshow.items.length <= 1) return;
		if(slideshow.animating && slideshow.supportAnimation) return;
		slideshow.animating = true;
		Util.addClass(slideshow.element, slideshow.animatingClass); 
		if(index < 0) index = slideshow.items.length - 1;
		else if(index >= slideshow.items.length) index = 0;
		// skip slideshow item if it is hidden
		if(bool && Util.hasClass(slideshow.items[index], 'is-hidden')) {
			slideshow.animating = false;
			index = bool == 'next' ? index + 1 : index - 1;
			showNewItem(slideshow, index, bool);
			return;
		}
		// index of new slide is equal to index of slide selected item
		if(index == slideshow.selectedSlide) {
			slideshow.animating = false;
			return;
		}
		var exitItemClass = getExitItemClass(slideshow, bool, slideshow.selectedSlide, index);
		var enterItemClass = getEnterItemClass(slideshow, bool, slideshow.selectedSlide, index);
		// transition between slides
		if(!slideshow.animationOff) Util.addClass(slideshow.items[slideshow.selectedSlide], exitItemClass);
		Util.removeClass(slideshow.items[slideshow.selectedSlide], 'slideshow__item--selected');
		slideshow.items[slideshow.selectedSlide].setAttribute('aria-hidden', 'true'); //hide to sr element that is exiting the viewport
		if(slideshow.animationOff) {
			Util.addClass(slideshow.items[index], 'slideshow__item--selected');
		} else {
			Util.addClass(slideshow.items[index], enterItemClass+' slideshow__item--selected');
		}
		// reset slider navigation appearance
		resetSlideshowNav(slideshow, index, slideshow.selectedSlide);
		slideshow.selectedSlide = index;
		// reset autoplay
		slideshow.pauseAutoplay();
		slideshow.startAutoplay();
		// reset controls/navigation color themes
		resetSlideshowTheme(slideshow, index);
		// emit event
		emitSlideshowEvent(slideshow, 'newItemSelected', slideshow.selectedSlide);
		if(slideshow.animationOff) {
			slideshow.animating = false;
			Util.removeClass(slideshow.element, slideshow.animatingClass);
		}
	};

	function getExitItemClass(slideshow, bool, oldIndex, newIndex) {
		var className = '';
		if(bool) {
			className = (bool == 'next') ? 'slideshow__item--'+slideshow.animationType+'-out-right' : 'slideshow__item--'+slideshow.animationType+'-out-left'; 
		} else {
			className = (newIndex < oldIndex) ? 'slideshow__item--'+slideshow.animationType+'-out-left' : 'slideshow__item--'+slideshow.animationType+'-out-right';
		}
		return className;
	};

	function getEnterItemClass(slideshow, bool, oldIndex, newIndex) {
		var className = '';
		if(bool) {
			className = (bool == 'next') ? 'slideshow__item--'+slideshow.animationType+'-in-right' : 'slideshow__item--'+slideshow.animationType+'-in-left'; 
		} else {
			className = (newIndex < oldIndex) ? 'slideshow__item--'+slideshow.animationType+'-in-left' : 'slideshow__item--'+slideshow.animationType+'-in-right';
		}
		return className;
	};

	function resetSlideshowNav(slideshow, newIndex, oldIndex) {
		if(slideshow.navigation) {
			Util.removeClass(slideshow.navigation[oldIndex], 'slideshow__nav-item--selected');
			Util.addClass(slideshow.navigation[newIndex], 'slideshow__nav-item--selected');
			slideshow.navCurrentLabel.parentElement.removeChild(slideshow.navCurrentLabel);
			slideshow.navigation[newIndex].getElementsByTagName('button')[0].appendChild(slideshow.navCurrentLabel);
		}
	};

	function resetSlideshowTheme(slideshow, newIndex) {
		var dataTheme = slideshow.items[newIndex].getAttribute('data-theme');
		if(dataTheme) {
			if(slideshow.navigation) slideshow.navigation[0].parentElement.setAttribute('data-theme', dataTheme);
			if(slideshow.controls[0]) slideshow.controls[0].parentElement.setAttribute('data-theme', dataTheme);
		} else {
			if(slideshow.navigation) slideshow.navigation[0].parentElement.removeAttribute('data-theme');
			if(slideshow.controls[0]) slideshow.controls[0].parentElement.removeAttribute('data-theme');
		}
	};

	function emitSlideshowEvent(slideshow, eventName, detail) {
		var event = new CustomEvent(eventName, {detail: detail});
		slideshow.element.dispatchEvent(event);
	};

	function updateAriaLive(slideshow) {
		slideshow.ariaLive.innerHTML = 'Item '+(slideshow.selectedSlide + 1)+' of '+slideshow.items.length;
	};

	function externalControlSlide(slideshow, button) { // control slideshow using external element
		button.addEventListener('click', function(event){
			var index = button.getAttribute('data-index');
			if(!index || index == slideshow.selectedSlide + 1) return;
			event.preventDefault();
			showNewItem(slideshow, index - 1, false);
		});
	};

	Slideshow.defaults = {
    element : '',
    navigation : true,
    autoplay : false,
		autoplayOnHover: false,
    autoplayInterval: 5000,
    swipe: false
  };

	window.Slideshow = Slideshow;
	
	//initialize the Slideshow objects
	var slideshows = document.getElementsByClassName('js-slideshow');
	if( slideshows.length > 0 ) {
		for( var i = 0; i < slideshows.length; i++) {
			(function(i){
				var navigation = (slideshows[i].getAttribute('data-navigation') && slideshows[i].getAttribute('data-navigation') == 'off') ? false : true,
					autoplay = (slideshows[i].getAttribute('data-autoplay') && slideshows[i].getAttribute('data-autoplay') == 'on') ? true : false,
					autoplayOnHover = (slideshows[i].getAttribute('data-autoplay-hover') && slideshows[i].getAttribute('data-autoplay-hover') == 'on') ? true : false,
					autoplayInterval = (slideshows[i].getAttribute('data-autoplay-interval')) ? slideshows[i].getAttribute('data-autoplay-interval') : 5000,
					swipe = (slideshows[i].getAttribute('data-swipe') && slideshows[i].getAttribute('data-swipe') == 'on') ? true : false;
				new Slideshow({element: slideshows[i], navigation: navigation, autoplay : autoplay, autoplayOnHover: autoplayOnHover, autoplayInterval : autoplayInterval, swipe : swipe});
			})(i);
		}
	}
}());
// File#: _2_sticky-sharebar
// Usage: codyhouse.co/license
(function() {
  var StickyShareBar = function(element) {
    this.element = element;
    this.contentTarget = document.getElementsByClassName('js-sticky-sharebar-target');
    this.contentTargetOut = document.getElementsByClassName('js-sticky-sharebar-target-out');
    this.showClass = 'sticky-sharebar--on-target';
    this.threshold = '50%'; // Share Bar will be revealed when .js-sticky-sharebar-target element reaches 50% of the viewport
    initShareBar(this);
    initTargetOut(this);
  };

  function initShareBar(shareBar) {
    if(shareBar.contentTarget.length < 1) {
      shareBar.showSharebar = true;
      Util.addClass(shareBar.element, shareBar.showClass);
      return;
    }
    if(intersectionObserverSupported) {
      shareBar.showSharebar = false;
      initObserver(shareBar); // update anchor appearance on scroll
    } else {
      Util.addClass(shareBar.element, shareBar.showClass);
    }
  };

  function initObserver(shareBar) { // target of Sharebar
    var observer = new IntersectionObserver(
      function(entries, observer) { 
        shareBar.showSharebar = entries[0].isIntersecting;
        toggleSharebar(shareBar);
      }, 
      {rootMargin: "0px 0px -"+shareBar.threshold+" 0px"}
    );
    observer.observe(shareBar.contentTarget[0]);
  };

  function initTargetOut(shareBar) { // target out of Sharebar
    shareBar.hideSharebar = false;
    if(shareBar.contentTargetOut.length < 1) {
      return;
    }
    var observer = new IntersectionObserver(
      function(entries, observer) { 
        shareBar.hideSharebar = entries[0].isIntersecting;
        toggleSharebar(shareBar);
      }
    );
    observer.observe(shareBar.contentTargetOut[0]);
  };

  function toggleSharebar(shareBar) {
    Util.toggleClass(shareBar.element, shareBar.showClass, shareBar.showSharebar && !shareBar.hideSharebar);
  };

  //initialize the StickyShareBar objects
  var stickyShareBar = document.getElementsByClassName('js-sticky-sharebar'),
    intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
  
	if( stickyShareBar.length > 0 ) {
		for( var i = 0; i < stickyShareBar.length; i++) {
			(function(i){ new StickyShareBar(stickyShareBar[i]); })(i);
    }
	}
}());
// File#: _2_tabs-v2
// Usage: codyhouse.co/license
// File#: _3_expandable-img-gallery
// Usage: codyhouse.co/license

(function() {
  var ExpGallery = function(element) {
    this.element = element;
    this.slideshow = this.element.getElementsByClassName('js-exp-lightbox__body')[0];
    this.slideshowList = this.element.getElementsByClassName('js-exp-lightbox__slideshow')[0];
    this.slideshowId = this.element.getAttribute('id')
    this.gallery = document.querySelector('[data-controls="'+this.slideshowId+'"]');
    this.galleryItems = this.gallery.getElementsByClassName('js-exp-gallery__item');
    this.lazyload = this.gallery.getAttribute('data-placeholder');
    this.animationRunning = false;
    // menu bar
    this.menuBar = this.element.getElementsByClassName('js-menu-bar');
    initNewContent(this);
    initLightboxMarkup(this);
    lazyLoadLightbox(this);
    initSlideshow(this);
    initModal(this);
    initModalEvents(this);
  };

  function initNewContent(gallery) {
    // if the gallery uses the infinite load - make sure to update the modal gallery when new content is loaded
    gallery.infiniteScrollParent = gallery.gallery.closest('[data-container]');
    
    if(!gallery.infiniteScrollParent && Util.hasClass(gallery.gallery, 'js-infinite-scroll')) {
      gallery.infiniteScrollParent = gallery.gallery;
    }
    
    if(gallery.infiniteScrollParent) {
      gallery.infiniteScrollParent.addEventListener('content-loaded', function(event){
        initLightboxMarkup(gallery);
        initSlideshow(gallery);
      });
    }
  };

  function initLightboxMarkup(gallery) {
    // create items inside lightbox - modal slideshow
    var slideshowContent = '';
    for(var i = 0; i < gallery.galleryItems.length; i++) {
      var caption = gallery.galleryItems[i].getElementsByClassName('js-exp-gallery__caption'),
        image = gallery.galleryItems[i].getElementsByTagName('img')[0],
        caption = gallery.galleryItems[i].getElementsByClassName('js-exp-gallery__caption');
      // details
      var src = image.getAttribute('data-modal-src');
      if(!src) src = image.getAttribute('data-src');
      if(!src) src = image.getAttribute('src');
      var altAttr = image.getAttribute('alt')
      altAttr = altAttr ? 'alt="'+altAttr+'"' : '';
      var draggable = gallery.slideshow.getAttribute('data-swipe') == 'on' ? 'draggable="false" ondragstart="return false;"' : '';
      var imgBlock = gallery.lazyload 
        ? '<img data-src="'+src+'" data-loading="lazy" src="'+gallery.lazyload+'" '+altAttr+' '+draggable+' class=" pointer-events-auto">'
        : '<img src="'+src+'" data-loading="lazy" '+draggable+' class=" pointer-events-auto">';

      var captionBlock = caption.length > 0
        ? '<figcaption class="exp-lightbox__caption pointer-events-auto">'+caption[0].textContent+'</figcaption>'
        : '';

      slideshowContent = slideshowContent + '<li class="slideshow__item js-slideshow__item"><figure class="exp-lightbox__media"><div class="exp-lightbox__media-outer"><div class="exp-lightbox__media-inner">'+imgBlock+'</div></div>'+captionBlock+'</li>';
    }
    gallery.slideshowList.innerHTML = slideshowContent;
    gallery.slides = gallery.slideshowList.getElementsByClassName('js-slideshow__item');

    // append the morphing image - we will animate it from the selected slide to the final position (and viceversa)
    var imgMorph = document.createElement("div");
    Util.setAttributes(imgMorph, {'aria-hidden': 'true', 'class': 'exp-lightbox__clone-img-wrapper js-exp-lightbox__clone-img-wrapper', 'data-exp-morph': gallery.slideshowId});
    imgMorph.innerHTML = '<svg><defs><clipPath id="'+gallery.slideshowId+'-clip"><rect/></clipPath></defs><image height="100%" width="100%" clip-path="url(#'+gallery.slideshowId+'-clip)"></image></svg>';
    document.body.appendChild(imgMorph);
    gallery.imgMorph = document.querySelector('.js-exp-lightbox__clone-img-wrapper[data-exp-morph="'+gallery.slideshowId+'"]');
    gallery.imgMorphSVG = gallery.imgMorph.getElementsByTagName('svg')[0];
    gallery.imgMorphRect = gallery.imgMorph.getElementsByTagName('rect')[0];
    gallery.imgMorphImg = gallery.imgMorph.getElementsByTagName('image')[0];
    
    // append image for zoom in effect
    if(gallery.slideshow.getAttribute('data-zoom') == 'on') {
      var zoomImg = document.createElement("div");
      Util.setAttributes(zoomImg, {'aria-hidden': 'true', 'class': 'exp-lightbox__zoom exp-lightbox__zoom--no-transition js-exp-lightbox__zoom'});
      zoomImg.innerHTML = '<img>';
      gallery.element.appendChild(zoomImg);
      gallery.zoomImg = gallery.element.getElementsByClassName('js-exp-lightbox__zoom')[0];
    }
  };

  function lazyLoadLightbox(gallery) {
    // lazyload media of selected slide/prev slide/next slide
    gallery.slideshow.addEventListener('newItemSelected', function(event){
      // 'newItemSelected' is emitted by the Slideshow object when a new slide is selected
      gallery.selectedSlide = event.detail;
      lazyLoadSlide(gallery);
      // menu element - trigger new slide event
      triggerMenuEvent(gallery);
    });
  };

  function lazyLoadSlide(gallery) {
    setSlideMedia(gallery, gallery.selectedSlide);
    setSlideMedia(gallery, gallery.selectedSlide + 1);
    setSlideMedia(gallery, gallery.selectedSlide - 1);
  };

  function setSlideMedia(gallery, index) {
    if(index < 0) index = gallery.slides.length - 1;
    if(index > gallery.slides.length - 1) index = 0;
    var imgs = gallery.slides[index].querySelectorAll('img[data-src]');
    for(var i = 0; i < imgs.length; i++) {
      imgs[i].src = imgs[i].getAttribute('data-src');
    }
  };

  function initSlideshow(gallery) { 
    // reset slideshow navigation
    resetSlideshowControls(gallery);
    gallery.slideshowNav = gallery.element.getElementsByClassName('js-slideshow__control');

    if(gallery.slides.length <= 1) {
      toggleSlideshowElements(gallery, true);
      return;
    } 
    var swipe = (gallery.slideshow.getAttribute('data-swipe') && gallery.slideshow.getAttribute('data-swipe') == 'on') ? true : false;
    gallery.slideshowObj = new Slideshow({element: gallery.slideshow, navigation: false, autoplay : false, swipe : swipe});
  };

  function resetSlideshowControls(gallery) {
    var arrowControl = gallery.element.getElementsByClassName('js-slideshow__control');
    if(arrowControl.length == 0) return;
    var controlsWrapper = arrowControl[0].parentElement;
    if(!controlsWrapper) return;
    controlsWrapper.innerHTML = controlsWrapper.innerHTML;
  };

  function toggleSlideshowElements(gallery, bool) { // hide slideshow controls if gallery is composed by one item only
    if(gallery.slideshowNav.length > 0) {
      for(var i = 0; i < gallery.slideshowNav.length; i++) {
        bool ? Util.addClass(gallery.slideshowNav[i], 'is-hidden') : Util.removeClass(gallery.slideshowNav[i], 'is-hidden');
      }
    }
  };

  function initModal(gallery) {
    Util.addClass(gallery.element, 'exp-lightbox--no-transition'); // add no-transition class to lightbox - used to select the first visible slide
    gallery.element.addEventListener('modalIsClose', function(event){ // add no-transition class
      Util.addClass(gallery.element, 'exp-lightbox--no-transition');
      gallery.imgMorph.style = '';
    });
    // trigger modal lightbox
    gallery.gallery.addEventListener('click', function(event){
      openModalLightbox(gallery, event);
    });
  };

  function initModalEvents(gallery) {
   if(gallery.zoomImg) { // image zoom
      gallery.slideshow.addEventListener('click', function(event){
        if(event.target.tagName.toLowerCase() == 'img' && event.target.closest('.js-slideshow__item') && !gallery.modalSwiping) modalZoomImg(gallery, event.target);
      });

      gallery.zoomImg.addEventListener('click', function(event){
        modalZoomImg(gallery, false);
      });

      gallery.element.addEventListener('modalIsClose', function(event){
        modalZoomImg(gallery, false); // close zoom-in image if open
        closeModalAnimation(gallery);
      });
    }

    if(!gallery.slideshowObj) return;

    if(gallery.slideshowObj.options.swipe) { // close gallery when you swipeUp/SwipeDown
      gallery.slideshowObj.element.addEventListener('swipeUp', function(event){
        closeModal(gallery);
      });
      gallery.slideshowObj.element.addEventListener('swipeDown', function(event){
        closeModal(gallery);
      });
    }
    
    if(gallery.zoomImg && gallery.slideshowObj.options.swipe) {
      gallery.slideshowObj.element.addEventListener('swipeLeft', function(event){
        gallery.modalSwiping = true;
      });
      gallery.slideshowObj.element.addEventListener('swipeRight', function(event){
        gallery.modalSwiping = true;
      });
      gallery.slideshowObj.element.addEventListener('newItemVisible', function(event){
        gallery.modalSwiping = false;
      });
    }
  };

  function openModalLightbox(gallery, event) {
    var item = event.target.closest('.js-exp-gallery__item');
    if(!item) return;
    // reset slideshow items visibility
    resetSlideshowItemsVisibility(gallery);
    gallery.selectedSlide = Util.getIndexInArray(gallery.galleryItems, item);
    setSelectedItem(gallery);
    lazyLoadSlide(gallery);
    if(animationSupported) { // start expanding animation
      window.requestAnimationFrame(function(){
        animateSelectedImage(gallery);
        openModal(gallery, item);
      });
    } else { // no expanding animation -> show modal
      openModal(gallery, item);
      Util.removeClass(gallery.element, 'exp-lightbox--no-transition');
    }
    // menu element - trigger new slide event
    triggerMenuEvent(gallery);
  };

  function resetSlideshowItemsVisibility(gallery) {
    var index = 0;
    for(var i = 0; i < gallery.galleryItems.length; i++) {
      var itemVisible = isVisible(gallery.galleryItems[i]);
      if(itemVisible) {
        index = index + 1;
        Util.removeClass(gallery.slides[i], 'is-hidden');
      } else {
        Util.addClass(gallery.slides[i], 'is-hidden');
      }
    }
    toggleSlideshowElements(gallery, index < 2);
  };

  function setSelectedItem(gallery) {
    // if a specific slide was selected -> make sure to show that item first
    var lastSelected = gallery.slideshow.getElementsByClassName('slideshow__item--selected');
    if(lastSelected.length > 0 ) Util.removeClass(lastSelected[0], 'slideshow__item--selected');
    Util.addClass(gallery.slides[gallery.selectedSlide], 'slideshow__item--selected');
    if(gallery.slideshowObj) gallery.slideshowObj.selectedSlide = gallery.selectedSlide;
  };

  function openModal(gallery, item) {
    gallery.element.dispatchEvent(new CustomEvent('openModal', {detail: item}));
    gallery.modalSwiping = false;
  };

  function closeModal(gallery) {
    gallery.modalSwiping = true;
    modalZoomImg(gallery, false);
    gallery.element.dispatchEvent(new CustomEvent('closeModal'));
  };

  function closeModalAnimation(gallery) { // modal is already closing -> start image closing animation
    gallery.selectedSlide = gallery.slideshowObj ? gallery.slideshowObj.selectedSlide : 0;
    // on close - make sure last selected image (of the gallery) is in the viewport
    var boundingRect = gallery.galleryItems[gallery.selectedSlide].getBoundingClientRect();
		if(boundingRect.top < 0 || boundingRect.top > window.innerHeight) {
			var windowScrollTop = window.scrollY || document.documentElement.scrollTop;
			window.scrollTo(0, boundingRect.top + windowScrollTop);
		}
    // animate on close
    animateSelectedImage(gallery, true);
  };

  function modalZoomImg(gallery, img) { // toggle zoom-in image
    if(!gallery.zoomImg) return;
    var bool = false;
    if(img) { // open zoom-in image
      gallery.originImg = img;
      gallery.zoomImg.children[0].setAttribute('src', img.getAttribute('src'));
      bool = true;
    }
    (animationSupported) 
      ? requestAnimationFrame(function(){animateZoomImg(gallery, bool)})
      : Util.toggleClass(gallery.zoomImg, 'exp-lightbox__zoom--is-visible', bool);
  };

  function animateZoomImg(gallery, bool) {
    if(!gallery.originImg) return;
    
    var originImgPosition = gallery.originImg.getBoundingClientRect(),
      originStyle = 'translateX('+originImgPosition.left+'px) translateY('+(originImgPosition.top + gallery.zoomImg.scrollTop)+'px) scale('+ originImgPosition.width/gallery.zoomImg.scrollWidth+')',
      finalStyle = 'scale(1)';

    if(bool) {
      gallery.zoomImg.children[0].style.transform = originStyle;
    } else {
      gallery.zoomImg.addEventListener('transitionend', function cb(){
        Util.addClass(gallery.zoomImg, 'exp-lightbox__zoom--no-transition');
        gallery.zoomImg.scrollTop = 0;
        gallery.zoomImg.removeEventListener('transitionend', cb);
      });
    }
    setTimeout(function(){
      Util.removeClass(gallery.zoomImg, 'exp-lightbox__zoom--no-transition');
      Util.toggleClass(gallery.zoomImg, 'exp-lightbox__zoom--is-visible', bool);
      gallery.zoomImg.children[0].style.transform = (bool) ? finalStyle : originStyle;
    }, 50);
  };

  function animateSelectedImage(gallery, bool) { // create morphing image effect
    var imgInit = gallery.galleryItems[gallery.selectedSlide].getElementsByTagName('img')[0],
      imgInitPosition = imgInit.getBoundingClientRect(),
      imgFinal = gallery.slides[gallery.selectedSlide].getElementsByTagName('img')[0],
      imgFinalPosition = imgFinal.getBoundingClientRect();

    if(bool) {
      runAnimation(gallery, imgInit, imgInitPosition, imgFinal, imgFinalPosition, bool);
    } else {
      imgFinal.style.visibility = 'hidden';
      gallery.animationRunning = false;
      var image = new Image();
      image.onload = function () {
        if(gallery.animationRunning) return;
        imgFinalPosition = imgFinal.getBoundingClientRect();
        runAnimation(gallery, imgInit, imgInitPosition, imgFinal, imgFinalPosition, bool);
      }
      image.src = imgFinal.getAttribute('data-src') ? imgFinal.getAttribute('data-src') : imgFinal.getAttribute('src');
      if(image.complete) {
        gallery.animationRunning = true;
        imgFinalPosition = imgFinal.getBoundingClientRect();
        runAnimation(gallery, imgInit, imgInitPosition, imgFinal, imgFinalPosition, bool);
      }
    }
  };

  function runAnimation(gallery, imgInit, imgInitPosition, imgFinal, imgFinalPosition, bool) {
    // retrieve all animation params
    var scale = imgFinalPosition.width > imgFinalPosition.height ? imgFinalPosition.height/imgInitPosition.height : imgFinalPosition.width/imgInitPosition.width;
    var initHeight = imgFinalPosition.width > imgFinalPosition.height ? imgInitPosition.height : imgFinalPosition.height/scale,
      initWidth = imgFinalPosition.width > imgFinalPosition.height ? imgFinalPosition.width/scale : imgInitPosition.width;

    var initTranslateY = (imgInitPosition.height - initHeight)/2,
      initTranslateX = (imgInitPosition.width - initWidth)/2,
      initTop = imgInitPosition.top + initTranslateY,
      initLeft = imgInitPosition.left + initTranslateX;

    // get final states
    var translateX = imgFinalPosition.left - imgInitPosition.left,
      translateY = imgFinalPosition.top - imgInitPosition.top;

    var finTranslateX = translateX - initTranslateX,
    finTranslateY = translateY - initTranslateY;

    var initScaleX = imgInitPosition.width/initWidth,
      initScaleY = imgInitPosition.height/initHeight,
      finScaleX = 1,
      finScaleY = 1;

    if(bool) { // update params if this is a closing animation
      scale = 1/scale;
      finScaleX = initScaleX;
      finScaleY = initScaleY;
      initScaleX = 1;
      initScaleY = 1;
      finTranslateX = -1*finTranslateX;
      finTranslateY = -1*finTranslateY;
      initTop = imgFinalPosition.top;
      initLeft = imgFinalPosition.left;
      initHeight = imgFinalPosition.height;
      initWidth = imgFinalPosition.width;
    }
    
    if(!bool) {
      imgFinal.style.visibility = ''; // reset visibility
    }

    // set initial status
    gallery.imgMorph.setAttribute('style', 'height: '+initHeight+'px; width: '+initWidth+'px; top: '+initTop+'px; left: '+initLeft+'px;');
    gallery.imgMorphSVG.setAttribute('viewbox', '0 0 '+initWidth+' '+initHeight);
    Util.setAttributes(gallery.imgMorphImg, {'xlink:href': imgInit.getAttribute('src'), 'href': imgInit.getAttribute('src')});
    Util.setAttributes(gallery.imgMorphRect, {'style': 'height: '+initHeight+'px; width: '+initWidth+'px;', 'transform': 'translate('+(initWidth/2)*(1 - initScaleX)+' '+(initHeight/2)*(1 - initScaleY)+') scale('+initScaleX+','+initScaleY+')'});

    // reveal image and start animation
    Util.addClass(gallery.imgMorph, 'exp-lightbox__clone-img-wrapper--is-visible');
    Util.addClass(gallery.slideshowList, 'slideshow__content--is-hidden');
    Util.addClass(gallery.galleryItems[gallery.selectedSlide], 'exp-gallery-item-hidden');

    gallery.imgMorph.addEventListener('transitionend', function cb(event){ // reset elements once animation is over
      if(event.propertyName.indexOf('transform') < 0) return;
			Util.removeClass(gallery.element, 'exp-lightbox--no-transition');
      Util.removeClass(gallery.imgMorph, 'exp-lightbox__clone-img-wrapper--is-visible');
      Util.removeClass(gallery.slideshowList, 'slideshow__content--is-hidden');
      gallery.imgMorph.removeAttribute('style');
      gallery.imgMorphRect.removeAttribute('style');
      gallery.imgMorphRect.removeAttribute('transform');
      gallery.imgMorphImg.removeAttribute('href');
      gallery.imgMorphImg.removeAttribute('xlink:href');
      Util.removeClass(gallery.galleryItems[gallery.selectedSlide], 'exp-gallery-item-hidden');
			gallery.imgMorph.removeEventListener('transitionend', cb);
    });

    // trigger expanding/closing animation
    gallery.imgMorph.style.transform = 'translateX('+finTranslateX+'px) translateY('+finTranslateY+'px) scale('+scale+')';
    animateRectScale(gallery.imgMorphRect, initScaleX, initScaleY, finScaleX, finScaleY, initWidth, initHeight);
  };

  function animateRectScale(rect, scaleX, scaleY, finScaleX, finScaleY, width, height) {
    var currentTime = null,
      duration =  parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--exp-gallery-animation-duration'))*1000 || 300;

    var animateScale = function(timestamp){  
      if (!currentTime) currentTime = timestamp;         
      var progress = timestamp - currentTime;
      if(progress > duration) progress = duration;

      var valX = easeOutQuad(progress, scaleX, finScaleX-scaleX, duration),
        valY = easeOutQuad(progress, scaleY, finScaleY-scaleY, duration);

      rect.setAttribute('transform', 'translate('+(width/2)*(1 - valX)+' '+(height/2)*(1 - valY)+') scale('+valX+','+valY+')');
      if(progress < duration) {
        window.requestAnimationFrame(animateScale);
      }
    };

    function easeOutQuad(t, b, c, d) {
      t /= d;
      return -c * t*(t-2) + b;
    };
    
    window.requestAnimationFrame(animateScale);
  };

  function keyboardNavigateLightbox(gallery, direction) {
    if(!Util.hasClass(gallery.element, 'modal--is-visible')) return;
    if(!document.activeElement.closest('.js-exp-lightbox__body') && document.activeElement.closest('.js-modal')) return;
    if(!gallery.slideshowObj) return;
    (direction == 'next') ? gallery.slideshowObj.showNext() : gallery.slideshowObj.showPrev();
  };

  function triggerMenuEvent(gallery) {
    if(gallery.menuBar.length < 1) return;
    var event = new CustomEvent('update-menu', 
      {detail: {
        index: gallery.selectedSlide,
        item: gallery.slides[gallery.selectedSlide]
      }});
    gallery.menuBar[0].dispatchEvent(event);
  };

  function isVisible(element) {
    return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
  };

  window.ExpGallery = ExpGallery;

  // init ExpGallery objects
  var expGalleries = document.getElementsByClassName('js-exp-lightbox'),
    animationSupported = window.requestAnimationFrame && !Util.osHasReducedMotion();
  if( expGalleries.length > 0 ) {
    var expGalleriesArray = [];
    for( var i = 0; i < expGalleries.length; i++) {
      (function(i){ expGalleriesArray.push(new ExpGallery(expGalleries[i]));})(i);

      // Lightbox gallery navigation with keyboard
      window.addEventListener('keydown', function(event){
        if(event.keyCode && event.keyCode == 39 || event.key && event.key.toLowerCase() == 'arrowright') {
          updateLightbox('next');
        } else if(event.keyCode && event.keyCode == 37 || event.key && event.key.toLowerCase() == 'arrowleft') {
          updateLightbox('prev');
        }
      });

      function updateLightbox(direction) {
        for( var i = 0; i < expGalleriesArray.length; i++) {
          (function(i){keyboardNavigateLightbox(expGalleriesArray[i], direction);})(i);
        };
      };
    }
  }
}());
// File#: _3_thumbnail-slideshow
// Usage: codyhouse.co/license
(function() {
	var ThumbSlideshow = function(element) {
		this.element = element;
		this.slideshow = this.element.getElementsByClassName('slideshow')[0];
		this.slideshowItems = this.slideshow.getElementsByClassName('js-slideshow__item');
		this.carousel = this.element.getElementsByClassName('thumbslide__nav-wrapper')[0];
		this.carouselList = this.carousel.getElementsByClassName('thumbslide__nav-list')[0];
		this.carouselListWrapper = this.carousel.getElementsByClassName('thumbslide__nav')[0];
		this.carouselControls = this.element.getElementsByClassName('js-thumbslide__tb-control');
		// custom obj
		this.slideshowObj = false;
		// thumb properties
		this.thumbItems = false;
		this.thumbOriginalWidth = false;
		this.thumbOriginalHeight = false;
		this.thumbVisibItemsNb = false;
		this.itemsWidth = false;
		this.itemsHeight = false;
		this.itemsMargin = false;
		this.thumbTranslateContainer = false;
		this.thumbTranslateVal = 0;
		// vertical variation
		this.thumbVertical = Util.hasClass(this.element, 'thumbslide--vertical');
		// recursive update 
		this.recursiveDirection = false;
		// drag events 
		this.thumbDragging = false;
		this.dragStart = false;
		// resize
		this.resize = false;
		// image load -> store info about thumb image being loaded
		this.loaded = false;
		initThumbs(this);
		initSlideshow(this);
		checkImageLoad(this);
	};

	function initThumbs(thumbSlider) { // create thumb items
		var carouselItems = '';
		for(var i = 0; i < thumbSlider.slideshowItems.length; i++) {
			var url = thumbSlider.slideshowItems[i].getAttribute('data-thumb'),
				alt = thumbSlider.slideshowItems[i].getAttribute('data-alt');
			if(!alt) alt = 'Image Preview';
			carouselItems = carouselItems + '<li class="thumbslide__nav-item"><img src="'+url+'" alt="'+alt+'">'+'</li>';
		}
		thumbSlider.carouselList.innerHTML = carouselItems;
		if(!thumbSlider.thumbVertical) initThumbsLayout(thumbSlider);
		else loadThumbsVerticalLayout(thumbSlider);
	};

	function initThumbsLayout(thumbSlider) {  // set thumbs visible numbers + width
		// evaluate size of single elements + number of visible elements
		thumbSlider.thumbItems = thumbSlider.carouselList.getElementsByClassName('thumbslide__nav-item');
		
		var itemStyle = window.getComputedStyle(thumbSlider.thumbItems[0]),
      containerStyle = window.getComputedStyle(thumbSlider.carouselListWrapper),
			itemWidth = parseFloat(itemStyle.getPropertyValue('width')),
			itemMargin = parseFloat(itemStyle.getPropertyValue('margin-right')),
      containerPadding = parseFloat(containerStyle.getPropertyValue('padding-left')),
      containerWidth = parseFloat(containerStyle.getPropertyValue('width'));

    if( !thumbSlider.thumbOriginalWidth) { // on resize -> use initial width of items to recalculate 
      thumbSlider.thumbOriginalWidth = itemWidth;
    } else {
      itemWidth = thumbSlider.thumbOriginalWidth;
    }
    // get proper width of elements
    thumbSlider.thumbVisibItemsNb = parseInt((containerWidth - 2*containerPadding + itemMargin)/(itemWidth+itemMargin));
    thumbSlider.itemsWidth = ((containerWidth - 2*containerPadding + itemMargin)/thumbSlider.thumbVisibItemsNb) - itemMargin;
    thumbSlider.thumbTranslateContainer = (((thumbSlider.itemsWidth+itemMargin)* thumbSlider.thumbVisibItemsNb));
    thumbSlider.itemsMargin = itemMargin;
    // flexbox fallback
    if(!flexSupported) thumbSlider.carouselList.style.width = (thumbSlider.itemsWidth + itemMargin)*thumbSlider.slideshowItems.length+'px';
		setThumbsWidth(thumbSlider);
	};

	function checkImageLoad(thumbSlider) {
		if(!thumbSlider.thumbVertical) { // no need to wait for image load, we already have their width
			updateVisibleThumb(thumbSlider, 0);
			updateThumbControls(thumbSlider);
			initTbSlideshowEvents(thumbSlider);
		} else { // wait for image to be loaded -> need to know the right height
			var image = new Image();
			image.onload = function () {thumbSlider.loaded = true;}
			image.onerror = function () {thumbSlider.loaded = true;}
			image.src = thumbSlider.slideshowItems[0].getAttribute('data-thumb');
		}
	};

	function loadThumbsVerticalLayout(thumbSlider) {
		// this is the vertical layout -> we need to make sure the thumb are loaded before checking the value of their height
		if(thumbSlider.loaded) {
			initThumbsVerticalLayout(thumbSlider);
			updateVisibleThumb(thumbSlider, 0);
			updateThumbControls(thumbSlider);
			initTbSlideshowEvents(thumbSlider);
		} else { // wait for thumbs to be loaded
			setTimeout(function(){
				loadThumbsVerticalLayout(thumbSlider);
			}, 100);
		}
	}

	function initThumbsVerticalLayout(thumbSlider) {
		// evaluate size of single elements + number of visible elements
		thumbSlider.thumbItems = thumbSlider.carouselList.getElementsByClassName('thumbslide__nav-item');
		
		var itemStyle = window.getComputedStyle(thumbSlider.thumbItems[0]),
      containerStyle = window.getComputedStyle(thumbSlider.carouselListWrapper),
			itemWidth = parseFloat(itemStyle.getPropertyValue('width')),
			itemHeight = parseFloat(itemStyle.getPropertyValue('height')),
			itemRatio = itemWidth/itemHeight,
			itemMargin = parseFloat(itemStyle.getPropertyValue('margin-bottom')),
      containerPadding = parseFloat(containerStyle.getPropertyValue('padding-top')),
      containerWidth = parseFloat(containerStyle.getPropertyValue('width')),
      containerHeight = parseFloat(containerStyle.getPropertyValue('height'));

    if(!flexSupported) containerHeight = parseFloat(window.getComputedStyle(thumbSlider.element).getPropertyValue('height'));
    
    if( !thumbSlider.thumbOriginalHeight ) { // on resize -> use initial width of items to recalculate 
      thumbSlider.thumbOriginalHeight = itemHeight;
      thumbSlider.thumbOriginalWidth = itemWidth;
    } else {
    	resetOriginalSize(thumbSlider);
      itemHeight = thumbSlider.thumbOriginalHeight;
    }
    // get proper height of elements
    thumbSlider.thumbVisibItemsNb = parseInt((containerHeight - 2*containerPadding + itemMargin)/(itemHeight+itemMargin));
    thumbSlider.itemsHeight = ((containerHeight - 2*containerPadding + itemMargin)/thumbSlider.thumbVisibItemsNb) - itemMargin;
    thumbSlider.itemsWidth = thumbSlider.itemsHeight*itemRatio,
    thumbSlider.thumbTranslateContainer = (((thumbSlider.itemsHeight+itemMargin)* thumbSlider.thumbVisibItemsNb));
    thumbSlider.itemsMargin = itemMargin;
    // flexbox fallback
    if(!flexSupported) {
    	thumbSlider.carousel.style.height = (thumbSlider.itemsHeight + itemMargin)*thumbSlider.slideshowItems.length+'px';
			thumbSlider.carouselListWrapper.style.height = containerHeight+'px';
    }
		setThumbsWidth(thumbSlider);
	};

	function setThumbsWidth(thumbSlider) { // set thumbs width
    for(var i = 0; i < thumbSlider.thumbItems.length; i++) {
      thumbSlider.thumbItems[i].style.width = thumbSlider.itemsWidth+"px";
      if(thumbSlider.thumbVertical) thumbSlider.thumbItems[i].style.height = thumbSlider.itemsHeight+"px";
    }

    if(thumbSlider.thumbVertical) {
    	var padding = parseFloat(window.getComputedStyle(thumbSlider.carouselListWrapper).getPropertyValue('padding-left'));
    	thumbSlider.carousel.style.width = (thumbSlider.itemsWidth + 2*padding)+"px";
    	if(!flexSupported) thumbSlider.slideshow.style.width = (parseFloat(window.getComputedStyle(thumbSlider.element).getPropertyValue('width')) - (thumbSlider.itemsWidth + 2*padding) - 10) + 'px';
    }
  };

	function initSlideshow(thumbSlider) { // for the main slideshow, we are using the Slideshow component -> we only need to initialize the object
		var autoplay = (thumbSlider.slideshow.getAttribute('data-autoplay') && thumbSlider.slideshow.getAttribute('data-autoplay') == 'on') ? true : false,
			autoplayInterval = (thumbSlider.slideshow.getAttribute('data-autoplay-interval')) ? thumbSlider.slideshow.getAttribute('data-autoplay-interval') : 5000,
			swipe = (thumbSlider.slideshow.getAttribute('data-swipe') && thumbSlider.slideshow.getAttribute('data-swipe') == 'on') ? true : false;
		thumbSlider.slideshowObj = new Slideshow({element: thumbSlider.slideshow, navigation: false, autoplay : autoplay, autoplayInterval : autoplayInterval, swipe : swipe});
	};

	function initTbSlideshowEvents(thumbSlider) {
    // listen for new slide selection -> 'newItemSelected' custom event is emitted each time a new slide is selected
    thumbSlider.slideshowObj.element.addEventListener('newItemSelected', function(event){
			updateVisibleThumb(thumbSlider, event.detail);
    });

		// click on a thumbnail -> update slide in slideshow
		thumbSlider.carouselList.addEventListener('click', function(event){
			if(thumbSlider.thumbDragging) return;
			var selectedOption = event.target.closest('.thumbslide__nav-item');
			if(!selectedOption || Util.hasClass(selectedOption, 'thumbslide__nav-item--active')) return;
			thumbSlider.slideshowObj.showItem(Util.getIndexInArray(thumbSlider.carouselList.getElementsByClassName('thumbslide__nav-item'), selectedOption));
		});

		// reset thumbnails on resize
    window.addEventListener('resize', function(event){
    	if(thumbSlider.resize) return;
    	thumbSlider.resize = true;
      window.requestAnimationFrame(resetThumbsResize.bind(thumbSlider));
    });

    // enable drag on thumbnails
		new SwipeContent(thumbSlider.carouselList);
		thumbSlider.carouselList.addEventListener('dragStart', function(event){
			var coordinate =  getDragCoordinate(thumbSlider, event);
			thumbSlider.dragStart = coordinate;
			thumbDragEnd(thumbSlider);
		});
		thumbSlider.carouselList.addEventListener('dragging', function(event){
			if(!thumbSlider.dragStart) return;
			var coordinate =  getDragCoordinate(thumbSlider, event);
			if(thumbSlider.slideshowObj.animating || Math.abs(coordinate - thumbSlider.dragStart) < 20) return;
			Util.addClass(thumbSlider.element, 'thumbslide__nav-list--dragging');
			thumbSlider.thumbDragging = true;
			Util.addClass(thumbSlider.carouselList, 'thumbslide__nav-list--no-transition');
			var translate = thumbSlider.thumbVertical ? 'translateY' : 'translateX';
			setTranslate(thumbSlider, translate+'('+(thumbSlider.thumbTranslateVal + coordinate - thumbSlider.dragStart)+'px)');
		});
	};

	function thumbDragEnd(thumbSlider) {
		thumbSlider.carouselList.addEventListener('dragEnd', function cb(event){
			var coordinate = getDragCoordinate(thumbSlider, event);
			thumbSlider.thumbTranslateVal = resetTranslateToRound(thumbSlider, thumbSlider.thumbTranslateVal + coordinate - thumbSlider.dragStart);
			thumbShowNewItems(thumbSlider, false);
			thumbSlider.dragStart = false;
			Util.removeClass(thumbSlider.carouselList, 'thumbslide__nav-list--no-transition');
			thumbSlider.carouselList.removeEventListener('dragEnd', cb);
			setTimeout(function(){
				thumbSlider.thumbDragging = false;
			}, 50);
			Util.removeClass(thumbSlider.element, 'thumbslide__nav-list--dragging');
		});
	};

	function getDragCoordinate(thumbSlider, event) { // return the drag value based on direction of thumbs navugation
		return thumbSlider.thumbVertical ? event.detail.y : event.detail.x;
	}

	function resetTranslateToRound(thumbSlider, value) { // at the ed of dragging -> set translate of coontainer to right value
		var dimension = getItemDimension(thumbSlider);
		return Math.round(value/(dimension+thumbSlider.itemsMargin))*(dimension+thumbSlider.itemsMargin);
	};

	function resetThumbsResize() { // reset thumbs width on resize
		var thumbSlider = this;
		if(!thumbSlider.thumbVertical) initThumbsLayout(thumbSlider);
		else initThumbsVerticalLayout(thumbSlider);
    setThumbsWidth(thumbSlider);
    var dimension = getItemDimension(thumbSlider);
    // reset the translate value of the thumbs container as well
    if( (-1)*thumbSlider.thumbTranslateVal % (dimension + thumbSlider.itemsMargin) > 0 ) {
			thumbSlider.thumbTranslateVal = -1 * parseInt(((-1)*thumbSlider.thumbTranslateVal)/(dimension + thumbSlider.itemsMargin)) * (dimension + thumbSlider.itemsMargin); 
    	thumbShowNewItems(thumbSlider, false);
    }
    thumbSlider.resize = false;
	};

	function thumbShowNewItems(thumbSlider, direction) { // when a new slide is selected -> update position of thumbs navigation
		var dimension = getItemDimension(thumbSlider);
		if(direction == 'next') thumbSlider.thumbTranslateVal = thumbSlider.thumbTranslateVal - thumbSlider.thumbTranslateContainer;
		else if(direction == 'prev') thumbSlider.thumbTranslateVal = thumbSlider.thumbTranslateVal + thumbSlider.thumbTranslateContainer;
		// make sure translate value is correct
		if(-1*thumbSlider.thumbTranslateVal >= (thumbSlider.thumbItems.length - thumbSlider.thumbVisibItemsNb)*(dimension + thumbSlider.itemsMargin)) thumbSlider.thumbTranslateVal = -1*((thumbSlider.thumbItems.length - thumbSlider.thumbVisibItemsNb)*(dimension + thumbSlider.itemsMargin));
		if(thumbSlider.thumbTranslateVal > 0) thumbSlider.thumbTranslateVal = 0;

		var translate = thumbSlider.thumbVertical ? 'translateY' : 'translateX';
		setTranslate(thumbSlider, translate+'('+thumbSlider.thumbTranslateVal+'px)');
		updateThumbControls(thumbSlider);
	};

	function updateVisibleThumb(thumbSlider, index) { // update selected thumb
		// update selected thumbnails
		var selectedThumb = thumbSlider.carouselList.getElementsByClassName('thumbslide__nav-item--active');
		if(selectedThumb.length > 0) Util.removeClass(selectedThumb[0], 'thumbslide__nav-item--active');
		Util.addClass(thumbSlider.thumbItems[index], 'thumbslide__nav-item--active');
		// update carousel translate value if new thumb is not visible
		recursiveUpdateThumb(thumbSlider, index);
	};

	function recursiveUpdateThumb(thumbSlider, index) { // recursive function used to update the position of thumbs navigation (eg when going from last slide to first one)
		var dimension = getItemDimension(thumbSlider);
		if( ((index + 1 - thumbSlider.thumbVisibItemsNb)*(dimension + thumbSlider.itemsMargin) + thumbSlider.thumbTranslateVal >= 0) || ( index*(dimension + thumbSlider.itemsMargin) + thumbSlider.thumbTranslateVal <= 0 && thumbSlider.thumbTranslateVal < 0) ) {
			var increment = ((index + 1 - thumbSlider.thumbVisibItemsNb)*(dimension + thumbSlider.itemsMargin) + thumbSlider.thumbTranslateVal >= 0) ? 1 : -1;
			if( !thumbSlider.recursiveDirection || thumbSlider.recursiveDirection == increment) {
				thumbSlider.thumbTranslateVal = -1 * increment * (dimension + thumbSlider.itemsMargin) + thumbSlider.thumbTranslateVal;
				thumbSlider.recursiveDirection = increment;
				recursiveUpdateThumb(thumbSlider, index);
			} else {
				thumbSlider.recursiveDirection = false;
				thumbShowNewItems(thumbSlider, false);
			}
		} else {
			thumbSlider.recursiveDirection = false;
			thumbShowNewItems(thumbSlider, false);
		}
	}

	function updateThumbControls(thumbSlider) { // reset thumb controls style
		var dimension = getItemDimension(thumbSlider);
		Util.toggleClass(thumbSlider.carouselListWrapper, 'thumbslide__nav--scroll-start', (thumbSlider.thumbTranslateVal != 0));
		Util.toggleClass(thumbSlider.carouselListWrapper, 'thumbslide__nav--scroll-end', (thumbSlider.thumbTranslateVal != -1*((thumbSlider.thumbItems.length - thumbSlider.thumbVisibItemsNb)*(dimension + thumbSlider.itemsMargin))) && (thumbSlider.thumbItems.length > thumbSlider.thumbVisibItemsNb));
		if(thumbSlider.carouselControls.length == 0) return;
		Util.toggleClass(thumbSlider.carouselControls[0], 'thumbslide__tb-control--disabled', (thumbSlider.thumbTranslateVal == 0));
		Util.toggleClass(thumbSlider.carouselControls[1], 'thumbslide__tb-control--disabled', (thumbSlider.thumbTranslateVal == -1*((thumbSlider.thumbItems.length - thumbSlider.thumbVisibItemsNb)*(dimension + thumbSlider.itemsMargin))));
	};

	function getItemDimension(thumbSlider) {
		return thumbSlider.thumbVertical ? thumbSlider.itemsHeight : thumbSlider.itemsWidth;
	}

	function setTranslate(thumbSlider, translate) {
    thumbSlider.carouselList.style.transform = translate;
    thumbSlider.carouselList.style.msTransform = translate;
  };

  function resetOriginalSize(thumbSlider) {
		if( !Util.cssSupports('color', 'var(--var-name)') ) return;
		var thumbWidth = parseInt(getComputedStyle(thumbSlider.element).getPropertyValue('--thumbslide-thumbnail-auto-size'));
		if(thumbWidth == thumbSlider.thumbOriginalWidth) return;
		thumbSlider.thumbOriginalHeight = parseFloat((thumbSlider.thumbOriginalHeight)*(thumbWidth/thumbSlider.thumbOriginalWidth));
  	thumbSlider.thumbOriginalWidth = thumbWidth;
  };
	
	//initialize the ThumbSlideshow objects
	var thumbSlideshows = document.getElementsByClassName('js-thumbslide'),
		flexSupported = Util.cssSupports('align-items', 'stretch');
	if( thumbSlideshows.length > 0 ) {
		for( var i = 0; i < thumbSlideshows.length; i++) {
			(function(i){
				new ThumbSlideshow(thumbSlideshows[i]);
			})(i);
		}
	}
}());