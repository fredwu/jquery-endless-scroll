###
  Endless Scroll plugin for jQuery

  v1.7.1

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
    loader: '<div class="loading"><div>',
    callback: function(){
      alert('test');
    }
  });

  Configuration options:

  inflowPixels      integer         the number of pixels from the boundary of the element that triggers the event
  fireOnce          boolean         only fire once until the execution of the current event is completed
  fireDelay         integer         delay the subsequent firing, in milliseconds, 0 or false to disable delay
  loader            string          the HTML to be displayed during loading
  content           string|function Plain HTML content to insert after each call, can be either a string or a function
                                    that returns a string, when passed as a function it accepts three arguments:
                                      <fireSequence> the number of times the event triggered during the current page session
                                      <pageSequence> a positive or negative value that represents the scroll direction sequence
                                      <scrollDirection> a string of either 'prev' or 'next'
  insertBefore      string          jQuery selector syntax: where to put the loader as well as the plain HTML data
  insertAfter       string          jQuery selector syntax: where to put the loader as well as the plain HTML data
  callback          function        callback function, accepts three arguments:
                                      <fireSequence> the number of times the event triggered during the current page session
                                      <pageSequence> a positive or negative value that represents the scroll direction sequence
                                      <scrollDirection> a string of either 'prev' or 'next'
  resetCounter      function        resets the fire sequence counter if the function returns true, this function
                                    could also perform hook actions since it is applied at the start of the event
  ceaseFire         function        stops the event (no more endless scrolling) if the function returns true,
                                    accepts three arguments:
                                      <fireSequence> the number of times the event triggered during the current page session
                                      <pageSequence> a positive or negative value that represents the scroll direction sequence
                                      <scrollDirection> a string of either 'prev' or 'next'
  intervalFrequency integer         set the frequency of the scroll event checking, the larger the frequency number,
                                    the less memory it consumes - but also the less sensitive the event trigger becomes

  Usage tips:

  The plugin is more useful when used with the callback function, which can then make AJAX calls to retrieve content.
  The fire sequence argument (for the callback function) is useful for 'pagination'-like features.
###

class EndlessScroll
  defaults =
    inflowPixels:      50
    fireOnce:          true
    fireDelay:         150
    loader:            'Loading...'
    content:           ''
    insertBefore:      null
    insertAfter:       null
    intervalFrequency: 250
    resetCounter:      -> false
    callback:          -> true
    ceaseFire:         -> false

  constructor: (scope, options) ->
    @options         = $.extend({}, defaults, options)
    @contentStack    = []
    @scrollDirection = 'next'
    @firing          = true
    @fired           = false
    @fireSequence    = 0
    @pageSequence    = 0
    @nextSequence    = 1
    @prevSequence    = -1
    @lastScrollTop   = 0
    @insertLocation  = @options.insertAfter
    @didScroll       = false
    @isScrollable    = true
    @target          = scope
    @targetId        = ''
    @content         = ''
    @innerWrap       = $('.endless_scroll_inner_wrap', @target)

    @handleDeprecatedOptions()
    @setInsertPositionsWhenNecessary()

    $(scope).scroll =>
      @detectTarget(scope)
      @detectScrollDirection()

  run: ->
    setInterval (=>
      return unless @shouldTryFiring()
      return if @ceaseFireWhenNecessary()
      return unless @shouldBeFiring()

      @resetFireSequenceWhenNecessary()
      @acknowledgeFiring()
      @insertLoader()

      if @hasContent()
        @showContent()
        @fireCallback()
        @delayFireingWhenNecessary()

      @removeLoader()
    ), @options.intervalFrequency

  handleDeprecatedOptions: ->
    @options.content      = @options.data         if @options.data
    @options.inflowPixels = @options.bottomPixels if @options.bottomPixels

  setInsertPositionsWhenNecessary: ->
    @options.insertBefore = "#{@target.selector} div:first" if defaults.insertBefore is null
    @options.insertAfter  = "#{@target.selector} div:last"  if defaults.insertAfter is null

  detectTarget: (scope) ->
    @target   = scope
    @targetId = $(@target).attr('id')

  detectScrollDirection: ->
    @didScroll = true
    currentScrollTop = $(@target).scrollTop()

    if currentScrollTop > @lastScrollTop
      @scrollDirection = 'next'
    else
      @scrollDirection = 'prev'

    @lastScrollTop = currentScrollTop

  shouldTryFiring: ->
    shouldTryOrNot = @didScroll and @firing is true
    @didScroll = false if shouldTryOrNot
    shouldTryOrNot

  ceaseFireWhenNecessary: ->
    if @options.ceaseFire.apply(@target, [@fireSequence, @pageSequence, @scrollDirection])
      @firing = false
      true
    else
      false

  wrapContainer: ->
    if @innerWrap.length is 0
      @innerWrap = $(@target).wrapInner('<div class="endless_scroll_inner_wrap" />')
                             .find('.endless_scroll_inner_wrap')

  setScrollPositionWhenNecessary: (target) ->
    if @scrollDirection is 'prev' and target.scrollTop() <= @options.inflowPixels
      target.scrollTop(@options.inflowPixels)

  scrollableAreaMargin: (innerWrap, target) ->
    switch @scrollDirection
      when 'next'
        innerWrap.height() - $(target).height() <= $(target).scrollTop() + @options.inflowPixels
      when 'prev'
        $(target).scrollTop() <= @options.inflowPixels

  calculateScrollableCanvas: ->
    if @target is document or @target is window
      @isScrollable = @scrollableAreaMargin(document, window)
      @setScrollPositionWhenNecessary(window)
    else
      @wrapContainer()
      @isScrollable = @innerWrap.length > 0 and @scrollableAreaMargin(@innerWrap, @target)
      @setScrollPositionWhenNecessary(@target)

  shouldBeFiring: ->
    @calculateScrollableCanvas()

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

    switch @scrollDirection
      when 'next' then @pageSequence = @nextSequence++
      when 'prev' then @pageSequence = @prevSequence--

  insertContent: (content) ->
    switch @scrollDirection
      when 'next' then $(@options.insertAfter).after(content)
      when 'prev' then $(@options.insertBefore).before(content)

  insertLoader: ->
    @insertContent(
      "<div class=\"endless_scroll_loader_#{@targetId}
      endless_scroll_loader\">#{@options.loader}</div>"
    )

  removeLoader: ->
    $('.endless_scroll_loader_' + @targetId).fadeOut ->
      $(this).remove()

  hasContent: ->
    if typeof @options.content is 'function'
      @content = @options.content.apply(@target, [@fireSequence, @pageSequence, @scrollDirection])
    else
      @content = @options.content
    @content isnt false

  showContent: ->
    $('#endless_scroll_content_current').removeAttr 'id'
    @insertContent(
      "<div id=\"endless_scroll_content_current\"
      class=\"endless_scroll_content\" rel=\"#{@pageSequence}\">#{@content}</div>"
    )

  fireCallback: ->
    @options.callback.apply @target, [@fireSequence, @pageSequence, @scrollDirection]

  delayFireingWhenNecessary: ->
    if @options.fireDelay > 0
      $('body').after '<div id="endless_scroll_marker"></div>'
      $('#endless_scroll_marker').fadeTo @options.fireDelay, 1, =>
        $('#endless_scroll_marker').remove()
        @fired = false
    else
      @fired = false

(($) ->
  $.fn.endlessScroll = (options) ->
    new EndlessScroll(this, options).run()
)(jQuery)