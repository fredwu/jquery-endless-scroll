###
  Endless Scroll plugin for jQuery

  v1.6.0

  Copyright (c) 2008-2012 Fred Wu

  Dual licensed under the MIT and GPL licenses:
    http://www.opensource.org/licenses/mit-license.php
    http://www.gnu.org/licenses/gpl.html
###

###
  Usage:

  // using default options
  $(window).endlessScroll();

  // using some custom options
  $(window).endlessScroll({
    fireOnce: false,
    fireDelay: false,
    loader: "<div class=\"loading\"><div>",
    callback: function(){
      alert("test");
    }
  });

  Configuration options:

  bottomPixels      integer         the number of pixels from the bottom of the page that triggers the event
  fireOnce          boolean         only fire once until the execution of the current event is completed
  fireDelay         integer         delay the subsequent firing, in milliseconds, 0 or false to disable delay
  loader            string          the HTML to be displayed during loading
  content           string|function Plain HTML content to insert after each call, can be either a string or a function
                                    that returns a string, when passed as a function it accepts one argument: fire
                                    sequence (the number of times the event triggered during the current page session)
  insertAfter       string          jQuery selector syntax: where to put the loader as well as the plain HTML data
  callback          function        callback function, accepts one argument: fire sequence (the number of times
                                    the event triggered during the current page session)
  resetCounter      function        resets the fire sequence counter if the function returns true, this function
                                    could also perform hook actions since it is applied at the start of the event
  ceaseFire         function        stops the event (no more endless scrolling) if the function returns true,
                                    accepts one argument: fire sequence
  intervalFrequency integer         set the frequency of the scroll event checking, the larger the frequency number,
                                    the less memory it consumes - but also the less sensitive the event trigger becomes

  Usage tips:

  The plugin is more useful when used with the callback function, which can then make AJAX calls to retrieve content.
  The fire sequence argument (for the callback function) is useful for 'pagination'-like features.
###

class EndlessScroll
  defaults =
    bottomPixels:      50
    fireOnce:          true
    fireDelay:         150
    loader:            "Loading..."
    content:           ""
    insertAfter:       "div:last"
    intervalFrequency: 250
    resetCounter:      -> false
    callback:          -> true
    ceaseFire:         -> false

  constructor: (scope, options) ->
    @options      = $.extend({}, defaults, options)
    @firing       = true
    @fired        = false
    @fireSequence = 0
    @didScroll    = false
    @isScrollable = true
    @target       = scope
    @targetId     = ""
    @content      = ""
    @innerWrap    = $(".endless_scroll_inner_wrap", @target)

    @options.content = @options.data if @options.data

    $(scope).scroll =>
      @didScroll = true
      @target    = scope
      @targetId  = $(@target).attr("id")

  run: ->
    setInterval (=>
      if @shouldTryFiring()
        @didScroll = false
        return if @ceaseFireWhenNecessary()

        if @shouldBeFiring()
          @resetFireSequenceWhenNecessary()
          @acknowledgeFiring()
          @insertLoader()

          if @hasContent()
            @showContent()
            @fireCallback()
            @delayFireingWhenNecessary()

          @removeLoader()
    ), @options.intervalFrequency

  shouldTryFiring: ->
    @didScroll and @firing is true

  ceaseFireWhenNecessary: ->
    if @options.ceaseFire.apply(@target, [ @fireSequence ])
      @firing = false
      true
    else
      false

  wrapContainer: ->
    if @innerWrap.length is 0
      @innerWrap = $(@target).wrapInner("<div class=\"endless_scroll_inner_wrap\" />")
                             .find(".endless_scroll_inner_wrap")

  isScrollableOrNot: ->
    if @target is document or @target is window
      @isScrollable = (
        $(document).height() - $(window).height() \
        <= $(window).scrollTop() + @options.bottomPixels
      )
    else
      @wrapContainer()
      @isScrollable = (
        @innerWrap.length > 0 and (
          @innerWrap.height() - $(@target).height() \
          <= $(@target).scrollTop() + @options.bottomPixels
        )
      )

  shouldBeFiring: ->
    @isScrollableOrNot()
    @isScrollable and (
      @options.fireOnce is false or (
        @options.fireOnce is true and @fired isnt true
      )
    )

  resetFireSequenceWhenNecessary: ->
    @fireSequence = 0 if @options.resetCounter.apply(@target) is true

  acknowledgeFiring: ->
    @fired = true
    @fireSequence++

  insertLoader: ->
    $(@options.insertAfter).after(
      "<div class=\"endless_scroll_loader_" + @targetId \
      + " endless_scroll_loader\">" + @options.loader + "</div>"
    )

  removeLoader: ->
    $(".endless_scroll_loader_" + @targetId).fadeOut ->
      $(this).remove()

  hasContent: ->
    if typeof @options.content is "function"
      @content = @options.content.apply(@target, [ @fireSequence ])
    else
      @content = @options.content
    @content isnt false

  showContent: ->
    $(@options.insertAfter).after "<div id=\"endless_scroll_content\">" + @content + "</div>"
    $("#endless_scroll_content").hide().fadeIn 250, -> $(this).removeAttr "id"

  fireCallback: ->
    @options.callback.apply @target, [ @fireSequence ]

  delayFireingWhenNecessary: ->
    if @options.fireDelay > 0
      $("body").after "<div id=\"endless_scroll_marker\"></div>"
      $("#endless_scroll_marker").fadeTo @options.fireDelay, 1, =>
        $("#endless_scroll_marker").remove()
        @fired = false
    else
      @fired = false

(($) ->
  $.fn.endlessScroll = (options) ->
    new EndlessScroll(this, options).run()
)(jQuery)