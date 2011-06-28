# Endless Scroll

If you don’t already know, [endless scroll](http://www.google.com/search?q=endless+scroll) (or infinite scrolling) is a popular technique among web 2.0 sites such as [Google Reader](http://reader.google.com/) and [Live Image Search](http://www.live.com/?scope=images), where instead of paging through items using the traditional pagination technique, the page just keeps loading with new items attached to the end.

I have developed a jQuery plugin to easily achieve this.

There are a few options to customise the behaviour of this plugin:

- _bottomPixels_ (integer) – the number of pixels from the bottom of the page that triggers the event
- _fireOnce_ (boolean) – only fire once until the execution of the current event is completed
- _fireDelay_ (integer) – delay the subsequent firing, in milliseconds. 0 or false to disable delay.
- _loader_ (string) – HTML loader
- _data_ (string) – plain HTML data
- _insertAfter_ (string) – jQuery selector syntax: where to put the loader as well as the plain HTML data
- _callback_ (function) – callback function, accepets one argument: fire sequence (the number of times the event triggered during the current page session)
- _resetCounter_ (function) – resets the fire sequence counter if the function returns true, this function could also perform hook actions since it is applied at the start of the event

In a typical scenario, you won’t be using the `data` option, but rather the `callback` option. You may use it to trigger an AJAX call and updates/inserts your page content.

## Usage

``` js
// using default options
$(document).endlessScroll();
// using some custom options
$(document).endlessScroll({
  fireOnce: false,
  fireDelay: false,
  loader: "<div class="loading"><div>",
  callback: function(p){
    alert("test");
  }
});
```

## Demo

[Click here for a simple demo](http://www.beyondcoding.com/demos/endless-scroll/).

## Changelog

v1.4.2 [2011-01-08]

- Fixed a bug where calling the script on $(document) would fail.

v1.4.1 [2010-06-18]

- Fixed a bug where the callback fires when the inner wrap hasn’t been created.

v1.4 [2010-06-18]

- Endless Scroll now works with any elements, not just $(document)!

v1.3 [2009-04-20]

- Fixed a bug caused by ‘fireDelay‘.

v1.2 [2009-01-16]

- Added ‘resetCounter‘ option.

v1.1 [2009-01-15]

- Added ‘fireDelay‘ option.

v1.0 [2009-01-15]

- Initial release.

