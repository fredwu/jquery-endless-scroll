/*
  Endless Scroll plugin for jQuery

  v2.0.0.dev

  Copyright (c) 2008-2012 Fred Wu

  Licensed under the MIT licenses: http://www.opensource.org/licenses/mit-license.php
*/

/*
  Usage:

  // using default options
  $(window).endlessScroll();

  // using some custom options
  $("#images").endlessScroll({
    fireOnce:  false,
    fireDelay: false,
    loader:    '<div class="loading"><div>',
    callback:  function(){
      alert('test');
    }
  });

  Configuration options:

  pagesToKeep       integer         the number of 'pages' to keep before either end of the scrolling content are
                                    discarded, by default (value set to `null`) no content will be discarded

  inflowPixels      integer         the number of pixels from the boundary of the element that triggers the event

  fireOnce          boolean         only fire once until the execution of the current event is completed

  fireDelay         integer         delay the subsequent firing, in milliseconds, 0 or false to disable delay

  loader            string          the HTML to be displayed during loading

  content           string|function Plain HTML content to insert after each call, can be either a string or a function
                                    that returns a string, when passed as a function it accepts three arguments:
                                      <fireSequence>    the number of times the event triggered during the current page
                                                        session
                                      <pageSequence>    a positive or negative integer that represents the scroll
                                                        direction sequence
                                      <scrollDirection> a string of either 'prev' or 'next'

  insertBefore      string          jQuery selector syntax: where to put the loader as well as the plain HTML data

  insertAfter       string          jQuery selector syntax: where to put the loader as well as the plain HTML data

  intervalFrequency integer         set the frequency of the scroll event checking, the larger the frequency number,
                                    the less memory it consumes - but also the less sensitive the event trigger becomes

  ceaseFireOnEmpty  boolean         ceases fire automatically when the content is empty, set it to `false` if you are
                                    using `callback` instead of `content` for loading content

  resetCounter      function        resets the fire sequence counter if the function returns true, this function
                                    could also perform hook actions since it is applied at the start of the event

  callback          function        callback function, accepts three arguments:
                                      <fireSequence>    the number of times the event triggered during the current page
                                                        session
                                      <pageSequence>    a positive or negative integer that represents the scroll
                                                        direction sequence
                                      <scrollDirection> a string of either 'prev' or 'next'

  ceaseFire         function        stops the event (no more endless scrolling) if the function returns true,
                                    accepts three arguments:
                                      <fireSequence>    the number of times the event triggered during the current page
                                                        session
                                      <pageSequence>    a positive or negative integer that represents the scroll
                                                        direction sequence
                                      <scrollDirection> a string of either 'prev' or 'next'
*/

var EndlessScroll, Whether, dependencyLib;

window.EndlessScroll = EndlessScroll;

EndlessScroll = (function() {
  var defaults;

  defaults = {
    topPixels: 50,
    bottomPixels: 50,
    intervalFrequency: 250
  };

  function EndlessScroll(scope, options) {
    this.options = $.extend({}, defaults, options);
  }

  EndlessScroll.prototype.run = function() {
    return setInterval(function() {
      return true;
    }, this.options.intervalFrequency);
  };

  return EndlessScroll;

})();

Whether = (function() {

  function Whether() {}

  Whether.DocumentIsScrollableDownward = function(options) {
    return $(document).height() - $(window).height() <= $(window).scrollTop() + options.bottomPixels;
  };

  return Whether;

})();

dependencyLib = typeof Zepto === 'undefined' ? jQuery : Zepto;

(function($) {
  return $.fn.endlessScroll = function(options) {
    return new EndlessScroll(this, options).run();
  };
})(dependencyLib);
