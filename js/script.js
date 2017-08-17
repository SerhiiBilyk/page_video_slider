'use strict';

;
(function () {

  /*polyfill */
  if (!Array.prototype.fill) {
    Array.prototype.fill = function (value) {

      if (this == null) {
        throw new TypeError('this is null or not defined');
      }

      var O = Object(this);

      var len = O.length >>> 0;

      var start = arguments[1];
      var relativeStart = start >> 0;

      var k = relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len);

      var end = arguments[2];
      var relativeEnd = end === undefined ? len : end >> 0;

      var final = relativeEnd < 0 ? Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len);

      while (k < final) {
        O[k] = value;
        k++;
      }

      return O;
    };
  }

  if (!Array.prototype.forEach) {

    Array.prototype.forEach = function (callback, thisArg) {

      var T, k;

      if (this == null) {
        throw new TypeError(' this is null or not defined');
      }

      var O = Object(this);

      var len = O.length >>> 0;

      if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
      }

      if (arguments.length > 1) {
        T = thisArg;
      }

      k = 0;

      while (k < len) {

        var kValue;

        if (k in O) {

          kValue = O[k];

          callback.call(T, kValue, k, O);
        }

        k++;
      }
    };
  }

  if (!Array.prototype.map) {

    Array.prototype.map = function (callback, thisArg) {

      var T, A, k;

      if (this == null) {
        throw new TypeError(' this is null or not defined');
      }

      var O = Object(this);

      var len = O.length >>> 0;

      if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
      }

      if (arguments.length > 1) {
        T = thisArg;
      }
      A = new Array(len);
      k = 0;
      while (k < len) {
        var kValue, mappedValue;
        if (k in O) {
          kValue = O[k];
          mappedValue = callback.call(T, kValue, k, O);
          A[k] = mappedValue;
        }

        k++;
      }
      return A;
    };
  }
})();
(function () {
  function toArrayByClassName(nodes) {
    return [].slice.call(document.getElementsByClassName(nodes));
  }

  function distanceToTop(element) {
    return parseInt(element.offsetTop - window.pageYOffset);
  }

  /*cross browser addClass*/

  var doc = document,


  //toArrayByClassName = nodes => [].slice.call(doc.getElementsByClassName(nodes)),
  prev = doc.getElementById('prev'),
      next = doc.getElementById('next'),
      prev2 = doc.getElementById('prev-2'),
      next2 = doc.getElementById('next-2'),
      nav = doc.getElementById('nav'),


  //slides = toArrayByClassName('img'),
  slider_video = doc.getElementById('slider-video'),
      slides_video_img = toArrayByClassName('img-bind'),
      video_container = doc.getElementById('video-container'),
      films = ['lqzJqeeOAlQ', '2JOoto47aLE', 'ILek6YF1iac', 'lqzJqeeOAlQ'],
      player,
      details = doc.getElementById('details'),
      showDetails = doc.getElementById('show-details'),
      hideDetails = doc.getElementById('hide-details'),
      opacity_switch = false,
      lazyLoad = toArrayByClassName('lazy'),
      wrapper = doc.getElementById('wrapper'),
      navHeight = parseInt(getComputedStyle(nav).height),
      arrows = toArrayByClassName('arrow');

  arrows.forEach(function (element) {
    element.addEventListener('click', function moveDown(e) {
      console.log('clicked');
      var nextElement = e.target.parentNode.nextSibling.nextSibling;
      console.log(e.target.parentNode.nextSibling.nextSibling);
      e.target.classList.toggle('clicked');
      nextElement.classList.toggle('show');
    });
  });

  var Logos = function (settings) {
    var zero = new Array(14).fill(),
        logosImgItem = toArrayByClassName(settings.imgCssClass),
        _invoke,
        _stop;
    var getRandomRange = function getRandomRange(min, max) {

      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    };
    var imgSet = zero.map(function (element, index) {
      return element = index;
    });

    logosImgItem.forEach(function (element, index) {
      element.src = './img/logos/logo-' + imgSet[index] + '.jpg';
    });

    var draft = imgSet.splice(logosImgItem.length);
    var animation = function animation() {

      var random = getRandomRange(0, logosImgItem.length - 1);
      logosImgItem.forEach(function (element) {
        element.className = "logos__img";
      });
      logosImgItem.forEach(function (element, index) {
        if (random == index) {
          element.classList.toggle("hide");
          setTimeout(function () {
            var newImg = draft.shift();
            draft.push(imgSet[index]);
            imgSet[index] = newImg;
            element.src = './img/logos/logo-' + newImg + '.jpg';
          }, 1500);
        }
      });
    };

    return {
      invoke: function invoke() {
        _invoke = setInterval(animation, 4000);
      },
      stop: function stop() {
        _stop = clearInterval(_invoke);
      }
    };
  }({ imgCssClass: "logos__img" });
  Logos.invoke();

  showDetails.addEventListener('click', scrollIt(details));
  hideDetails.addEventListener('click', scrollIt(wrapper));

  var detailsState = function () {
    var state = false;

    function add() {
      state = true;
    }

    function sub() {
      state = false;
    }
    return {
      getState: function getState() {
        return state;
      },
      switcher: function switcher() {
        state ? state = false : state = true;
      }
    };
  }();
  window.addEventListener('scroll', lazyLoader);

  function lazyLoader() {

    //  console.log(lazyLoad)
    //  var distance=distanceToTop(details);
    //  console.log('scrolling',window.pageYOffset-distance)
    lazyLoad.forEach(function (element, index) {
      var elementHeight = element.scrollHeight;
      var distance = distanceToTop(element);

      if (window.pageYOffset > navHeight) {

        nav.classList.add('fixed');
      }
      if (window.pageYOffset > 300) {

        nav.classList.add('show');
      } else {
        nav.classList.remove('show');
      }
      if (window.pageYOffset < 200) {
        nav.classList.remove('fixed');
      }

      if (window.innerHeight - element.scrollHeight < window.pageYOffset - distance) {
        element.classList.add("opacity");
      }
      if (distance > window.innerHeight - elementHeight / 2 || elementHeight == 0) {

        element.classList.remove("opacity");

        //removeCssClass(element, 'opacity')
      }
    });
  }

  function scrollIt(destination) {

    var stateID;
    return function () {

      var state = detailsState.getState();
      console.log('state before click', state);
      if (!state) {
        details.className = "details display";
        showDetails.innerHTML = "hide";

        showDetails.setAttribute('disabled', 'disabled');
        doc.body.style.overflow = "hidden";
        detailsState.switcher();
        console.log('state after click ', state);
      } else if (state) {
        showDetails.removeAttribute('disabled'
        //details.className = "details";
        );doc.body.style.overflow = "hidden";
        showDetails.innerHTML = "learn more";
        detailsState.switcher();
        console.log('state return ', state);
      }
      /*always reset previous Interval*/
      clearInterval(stateID);
      setTimeout(function () {
        stateID = setInterval(scrollIncrement, 5);
      }, 500);

      function scrollIncrement() {
        /*
                FireFox and Internet Explorer use 'var html' height
                Chrome,Safari use 'var body' height
                startPoint + window.innerHeight === document.body.scrollHeight -> if true - bottom of document
                percentage ->quantity of scrolled %
                increment ->relative to percentage
                Math.ceil - round to biger number, if we go Down
                MAth.floor - round to less number, if we go Up
                */
        /*scrolltop scrollheight*/

        var html = document.documentElement,
            body = document.body,
            startPoint = window.pageYOffset || body.scrollTop || html.scrollTop,
            toTop = distanceToTop(destination),
            endPoint = Math.abs(toTop),
            direction = toTop / endPoint,
            bottom = endPoint + window.pageYOffset,
            percentage = startPoint / (bottom / 100),
            calculateStep = direction * (50 - 50 / 100 * percentage),
            increment;
        console.log('toTop', direction);

        direction > 0 ? increment = Math.ceil(calculateStep) : increment = Math.floor(calculateStep);
        if (endPoint != 1) {
          var newY = startPoint + increment;
          window.scrollTo(0, newY);
        } else {
          if (direction < 0) {
            console.log('direction less then 0, direction UP');
            details.className = "details";
          }
          console.log('direction', direction);

          clearInterval(stateID);
          opacity_switch = true;
          doc.body.style.overflow = "auto";

          lazyLoader();
        }
      } //scrollIncrement
    };
  }

  function Slider(slides) {
    this.slides = toArrayByClassName(slides);
    this.slidesVideoImg = toArrayByClassName('img-bind');
    this.indexArray = ['0%', '100%', '200%', '300%'];
    this.currentSlide = 1;
    this.clicked = false;
    this.changeSlides();
  }

  Slider.prototype.getCurrentSlideIndex = function () {
    return this.currentSlide;
  };
  Slider.prototype.incrementSlideIndex = function (increment) {

    this.currentSlide += increment;
    this.currentSlide > this.slides.length - 1 ? this.currentSlide = 0 : false;
    this.currentSlide < 0 ? this.currentSlide = this.slides.length - 1 : false;

    this.slides.forEach(function (element) {
      var attr = parseInt(element.getAttribute('data-index'));
      attr += increment;
      attr > 3 ? attr = 0 : false;
      attr < 0 ? attr = 3 : false;

      element.setAttribute('data-index', attr);
    });
  };
  Slider.prototype.animatedSlide = function (dataIndex) {
    var app = this;
    this.slides.forEach(function (element, index) {

      var computed = getComputedStyle(element);
      var data_index = parseInt(element.getAttribute('data-index'));

      if (data_index == dataIndex) {

        element.style.zIndex = "-1";
      }
      element.style.left = app.indexArray[data_index];
    });
	
	
	 var trEvent = this.transitionEvent();
    var app = this;
    function transitionCallback() {
	  app.clicked = false;
      console.log('Transition complete!  This is the callback, no library needed!');
      app.slides[0].removeEventListener(trEvent, transitionCallback);
	  
	  console.log(app.slides[0])
    
    }
	
    trEvent && this.slides[0].addEventListener(trEvent, transitionCallback);
  };

  Slider.prototype.transitionEvent = function () {

    var t;
    var el = this.slides[0];
    var transitions = {
      'transition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    };

    for (t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t];
      }
    }
  };

  Slider.prototype.changeSlides = function () {
   

    this.slidesVideoImg.forEach(function (element) {
      element.style.opacity = 0;
    });
    this.slidesVideoImg[this.currentSlide].style.opacity = "1";
  };

  Slider.prototype.transitionLogic = function () {

    var app = this;
    app.slides.forEach(function (element, index) {
      var data_index = parseInt(element.getAttribute('data-index'));
      if (data_index == 0) {

        var computed = getComputedStyle(element);
        if (computed.left == '0px') {

          element.style.zIndex = "1";
        }
      }
      if (data_index == app.slides.length - 1) {

        element.style.zIndex = "1";
      }
    });
  };
  Slider.prototype.move = function (increment, dataIndex, binded) {
console.log('clocked')
    var app = this;

    return function () {
      if (!app.clicked) {
        app.transitionLogic();
        app.incrementSlideIndex(increment);
		console.log('binded',binded)
        binded ? app.changeSlides() : false;

        app.animatedSlide(dataIndex);
        app.clicked = true;
      }
    };
  };
  var app = new Slider('img-1');

  prev.addEventListener('click', app.move(1, 0, true));
  next.addEventListener('click', app.move(-1, 3, true));

  var app2 = new Slider('img-2');

  prev2.addEventListener('click', app2.move(1, 0, false));
  next2.addEventListener('click', app2.move(-1, 3, false));

  slider_video.addEventListener('click', function (e) {
    var loadScript = function () {
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/player_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }();
    if (player) {
      player.loadVideoById({
        'videoId': films[app.getCurrentSlideIndex()]
      });
      player.playVideo();
      video_container.className = "video-container show";
    }
  });
  window.onYouTubePlayerAPIReady = function () {

    player = new YT.Player('player', {
      height: '1000',
      width: '1000',
      playerVars: {
        'controls': 0,
        'rel': 0,
        'modestbranding': 0,
        'autoplay': 1,
        'enablejsapi': 1

      },
      events: {
        'onReady': onReady,
        'onStateChange': closeVideo
      }

    });

    function onReady(e) {

      player.loadVideoById({
        'videoId': films[app.getCurrentSlideIndex()]
      });
      //  player.playVideo()
      setTimeout(function () {
        video_container.className = "video-container show";
      }, 500);
    }

    function closeVideo(e) {

      if (e.data == 2 || e.data == 0) {
        video_container.className = "video-container";
        player.stopVideo();
        return;
      }
    }
  };
} //global IIF
)();
