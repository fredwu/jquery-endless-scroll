/**
 * Endless Scroll plugin for jQuery
 *
 * v1.6.0
 *
 * Copyright (c) 2008-2012 Fred Wu
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

/**
 * Usage:
 *
 * // using default options
 * $(window).endlessScroll();
 *
 * // using some custom options
 * $(window).endlessScroll({
 *   fireOnce: false,
 *   fireDelay: false,
 *   loader: "<div class=\"loading\"><div>",
 *   callback: function(){
 *     alert("test");
 *   }
 * });
 *
 * Configuration options:
 *
 * bottomPixels      integer          the number of pixels from the bottom of the page that triggers the event
 * fireOnce          boolean          only fire once until the execution of the current event is completed
 * fireDelay         integer          delay the subsequent firing, in milliseconds, 0 or false to disable delay
 * loader            string           the HTML to be displayed during loading
 * content           string|function  Plain HTML content to insert after each call, can be either a string or a function
 *                                    that returns a string, when passed as a function it accepts one argument: fire
 *                                    sequence (the number of times the event triggered during the current page session)
 * insertAfter       string           jQuery selector syntax: where to put the loader as well as the plain HTML data
 * callback          function         callback function, accepts one argument: fire sequence (the number of times
 *                                    the event triggered during the current page session)
 * resetCounter      function         resets the fire sequence counter if the function returns true, this function
 *                                    could also perform hook actions since it is applied at the start of the event
 * ceaseFire         function         stops the event (no more endless scrolling) if the function returns true,
 *                                    accepts one argument: fire sequence
 * intervalFrequency integer          set the frequency of the scroll event checking, the larger the frequency number,
 *                                    the less memory it consumes - but also the less sensitive the event trigger becomes
 *
 * Usage tips:
 *
 * The plugin is more useful when used with the callback function, which can then make AJAX calls to retrieve content.
 * The fire sequence argument (for the callback function) is useful for 'pagination'-like features.
 */

(function($){
$.fn.endlessScroll = function(options) {

  var v = {}, // endless scroll global variables
      m = {}; // endless scroll global methods

  v.defaults = {
    bottomPixels:      50,
    fireOnce:          true,
    fireDelay:         150,
    loader:            'Loading...',
    content:           '',
    insertAfter:       'div:last',
    resetCounter:      function() { return false; },
    callback:          function() { return true; },
    ceaseFire:         function() { return false; },
    intervalFrequency: 250
  };

  v.options       = $.extend({}, v.defaults, options);
  v.firing        = true;
  v.fired         = false;
  v.fireSequence  = 0;
  v.didScroll     = false;
  v.isScrollable  = true;
  v.target        = this;
  v.targetId      = '';
  v.content       = '';
  v.innerWrap     = $('.endless_scroll_inner_wrap', v.target);

  m.initialize = function(targetDOM) {
    // deprecate `data` in favour of `content`
    if (v.options.data) {
      v.options.content = v.options.data;
    }

    $(targetDOM).scroll(function() {
      v.didScroll = true;
      v.target    = this;
      v.targetId  = $(v.target).attr('id');
    });
  };

  m.shouldTryFiring = function() {
    return v.didScroll && v.firing === true;
  };

  m.ceaseFireWhenNecessary = function() {
    if (v.options.ceaseFire.apply(v.target, [v.fireSequence])) {
      v.firing = false;
      return true;
    } else {
      return false;
    }
  };

  m.wrapContainer = function() {
    if (v.innerWrap.length == 0) {
      v.innerWrap = $(v.target).wrapInner('<div class="endless_scroll_inner_wrap" />')
                               .find('.endless_scroll_inner_wrap');
    }
  };

  m.isScrollableOrNot = function() {
    if (v.target == document || v.target == window) {
      v.isScrollable = (
        $(document).height() - $(window).height()
        <= $(window).scrollTop() + v.options.bottomPixels
      );
    } else {
      m.wrapContainer();
      v.isScrollable = (
        v.innerWrap.length > 0 && (
          v.innerWrap.height() - $(v.target).height()
          <= $(v.target).scrollTop() + v.options.bottomPixels
        )
      );
    }
  };

  m.shouldBeFiring = function() {
    m.isScrollableOrNot();

    return v.isScrollable && (
      v.options.fireOnce == false || (v.options.fireOnce == true && v.fired != true)
    );
  };

  m.resetFireSequenceWhenNecessary = function() {
    if (v.options.resetCounter.apply(v.target) === true) {
      v.fireSequence = 0;
    }
  };

  m.acknowledgeFiring = function() {
    v.fired = true;
    v.fireSequence++;
  };

  m.insertLoader = function() {
    $(v.options.insertAfter).after(
      '<div class="endless_scroll_loader_' + v.targetId
      + ' endless_scroll_loader">' + v.options.loader + '</div>'
    );
  };

  m.removeLoader = function() {
    $('.endless_scroll_loader_' + v.targetId).fadeOut(function() {
      $(this).remove();
    });
  };

  m.hasContent = function() {
    if (typeof v.options.content == 'function') {
      v.content = v.options.content.apply(v.target, [v.fireSequence]);
    } else {
      v.content = v.options.content;
    }

    return v.content !== false;
  };

  m.showContent = function() {
    $(v.options.insertAfter).after('<div id="endless_scroll_content">' + v.content + '</div>');
    $('#endless_scroll_content').hide().fadeIn(250, function() { $(this).removeAttr('id'); });
  };

  m.fireCallback = function() {
    v.options.callback.apply(v.target, [v.fireSequence]);
  };

  m.delayFireingWhenNecessary = function() {
    if (v.options.fireDelay > 0) {
      $('body').after('<div id="endless_scroll_marker"></div>');
      $('#endless_scroll_marker').fadeTo(v.options.fireDelay, 1, function() {
        $(this).remove();
        v.fired = false;
      });
    } else {
      v.fired = false;
    }
  };

  m.initialize(this);

  setInterval(function() {
    if (m.shouldTryFiring()) {
      v.didScroll = false;

      if (m.ceaseFireWhenNecessary()) {
        return;
      }

      if (m.shouldBeFiring()) {
        m.resetFireSequenceWhenNecessary();
        m.acknowledgeFiring();
        m.insertLoader();

        if (m.hasContent()) {
          m.showContent();
          m.fireCallback();
          m.delayFireingWhenNecessary();
        }

        m.removeLoader();
      }
    }
  }, v.options.intervalFrequency);

};
})(jQuery);