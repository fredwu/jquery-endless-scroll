# Endless Scroll [![endorse](http://api.coderwall.com/fredwu/endorsecount.png)](http://coderwall.com/fredwu)

If you don't already know, [endless scroll](http://www.google.com/search?q=endless+scroll) (or endless pagination, or infinite scrolling) is a popular technique among web 2.0 sites such as [Google Reader](http://reader.google.com/) and [Live Image Search](http://www.live.com/?scope=images), where instead of paging through items using the traditional pagination technique, the page just keeps loading with new items attached to the end.

## Configuration

There are a few options to customise the behaviour of this plugin:

<table>
  <tr>
    <td><strong>Option</strong></td>
    <td><strong>Type</strong></td>
    <td><strong>Description</strong></td>
  </tr>
  <tr>
    <td>bottomPixels</td>
    <td>Integer</td>
    <td>The number of pixels from the bottom of the page that triggers the event.</td>
  </tr>
  <tr>
    <td>fireOnce</td>
    <td>Boolean</td>
    <td>Only fire once until the execution of the current event is completed.</td>
  </tr>
  <tr>
    <td>fireDelay</td>
    <td>Integer</td>
    <td>Delays the subsequent firing, in milliseconds, 0 or false to disable delay.</td>
  </tr>
  <tr>
    <td>loader</td>
    <td>String</td>
    <td>The HTML to be displayed during loading.</td>
  </tr>
  <tr>
    <td>content</td>
    <td>String or Function</td>
    <td>Plain HTML content to insert after each call, can be either a string or a function that returns a string, when passed as a function it accepts one argument: fire sequence (the number of times the event triggered during the current page session).</td>
  </tr>
  <tr>
    <td>insertAfter</td>
    <td>String</td>
    <td>jQuery selector syntax: where to put the loader as well as the plain HTML data.</td>
  </tr>
  <tr>
    <td>callback</td>
    <td>Function</td>
    <td>Callback function, accepts one argument: <em>fireSequence</em> (the number of times the event triggered during the current page session).</td>
  </tr>
  <tr>
    <td>resetCounter</td>
    <td>Function</td>
    <td>Resets the fire sequence counter if the function returns true, this function could also perform hook actions since it is applied at the start of the event.</td>
  </tr>
  <tr>
    <td>ceaseFire</td>
    <td>Function</td>
    <td>Stops the event (no more endless scrolling) if the function returns true, accepts one argument: <em>fireSequence</em>.</td>
  </tr>
  <tr>
    <td>intervalFrequency</td>
    <td>Integer</td>
    <td>Set the frequency of the scroll event checking, the larger the frequency number, the less memory it consumes - but also the less sensitive the event trigger becomes.</td>
  </tr>
</table>

In a typical scenario, you won't be using the `data` option, but rather the `callback` option. You may use it to trigger an AJAX call and updates/inserts your page content.

## Usage

``` js
// using default options
$(window).endlessScroll();
// using some custom options
$(window).endlessScroll({
  fireOnce: false,
  fireDelay: false,
  loader: '<div class="loading"><div>',
  callback: function(p){
    alert("test");
  }
});
```

### Custom Loader Styles

You may customise the look and feel of the loader by changing:

- The `endless_scroll_loader` class;
- Or the `endless_scroll_loader_<scroller_dom_html_id>`.

## CoffeeScript and JavaScript

Endless Scroll, starting from v1.6.0 is written in [CoffeeScript](http://coffeescript.org/). To contribute and/or modify the source code, please edit `src/jquery.endless-scroll.coffee`. To include Endless Scroll in your webpage, please use `js/jquery.endless-scroll.js`.

## Demo

[Click here for a simple demo](http://fredwu.github.com/jquery-endless-scroll/).

## Browser Support

All modern browsers (Firefox, Chrome, Safari, Opera, IE7+) should be supported. Please [open an issue](https://github.com/fredwu/jquery-endless-scroll/issues) if Endless Scroll doesn't work on a particular browser.

## Changelog

v1.6.0 [2012-04-15]

- Refactored the code using CoffeeScript.
- Renamed `data` option to `content`.
- Tweaked the demo page.

v1.5.1 [2012-03-08]

- Added `fireSequence` argument to `ceaseFire`.
- Added a `ceaseFire` example to the demo page.
- Fixed `loader`.

v1.5.0 [2012-03-08]

- Added `intervalFrequency` option.
- Endless Scroll should now consume less memory in most situations.

v1.4.8 [2011-11-18]

- Refactored default options merge to avert side effects.

v1.4.7 [2011-11-08]

- Compatibility fix for IE7 and IE8.

v1.4.6 [2011-10-26]

- Fixed an issue with inner_wrap and the first scroll event.

v1.4.5 [2011-09-25]

- `ceaseFire` now works as expected during a `scroll` event.

v1.4.4 [2011-06-28]

- The AJAX loader should be removed when there's no more results to load.

v1.4.3 [2011-06-28]

- The `data` option now accepts a fireSequence argument too.

v1.4.2 [2011-01-08]

- Fixed a bug where calling the script on `$(document)` would fail.

v1.4.1 [2010-06-18]

- Fixed a bug where the callback fires when the inner wrap hasn't been created.

v1.4 [2010-06-18]

- Endless Scroll now works with any elements, not just `$(document)`!

v1.3 [2009-04-20]

- Fixed a bug caused by `fireDelay`.

v1.2 [2009-01-16]

- Added `resetCounter` option.

v1.1 [2009-01-15]

- Added `fireDelay` option.

v1.0 [2009-01-15]

- Initial release.

## More jQuery Plugins

Check out my other jQuery plugins:

- [Inline Confirmation](https://github.com/fredwu/jquery-inline-confirmation) - One of the less obtrusive ways of implementing confirmation dialogues.
- [Slideshow Lite](https://github.com/fredwu/jquery-slideshow-lite) - An extremely lightweight slideshow plugin for jQuery.

## License

Copyright (c) 2008-2012 Fred Wu

Dual licensed under the [MIT](http://www.opensource.org/licenses/mit-license.php) and [GPL](http://www.gnu.org/licenses/gpl.html) licenses.
