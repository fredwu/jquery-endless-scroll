/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Adapated for Mocha by Kelly Miyashiro (miyashiro.kelly@gmail.com)
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

/*global phantom:true*/

var fs = require('fs');
var system = require('system');

// The temporary file used for communications.
var tmpfile = system.args[1];
// The Mocha helper file to be injected.
var mochaHelper = system.args[2];
// The Mocha .html test file to run.
var url = system.args[3];
// Config
var configStr = system.args[4];

// Keep track of the last time a Mocha message was sent.
var last = new Date();

// Messages are sent to the parent by appending them to the tempfile.
function sendMessage(args) {
  last = new Date();
  fs.write(tmpfile, JSON.stringify(args) + '\n', 'a');
  // Exit when all done.
  if (/^done/.test(args[0])) {
    phantom.exit();
  }
}

// Send a debugging message.
function sendDebugMessage() {
  sendMessage(['debug'].concat([].slice.call(arguments)));
}

// Abort if Mocha doesn't do anything for a while.
setInterval(function() {
  if (new Date() - last > 5000) {
    sendMessage(['done_timeout']);
  }
}, 1000);

// Create a new page.
var page = require('webpage').create();

// Mocha sends its messages via alert(jsonstring);
page.onAlert = function(args) {
  sendMessage(JSON.parse(args));
};

page.onError = function(msg, trace) {
  var error = 'Page error: ' +  msg + '\n';
  trace.forEach(function(item) {
    error += '  ' + item.file + ':' + item.line + '\n';
  });
  sendDebugMessage(error);
};

// Additional message sending
page.onConsoleMessage = function(message) {
  var output;
  sendMessage(['console', message]);
};

// Keep track if Mocha has been injected already
var injected;

page.onResourceRequested = function(request) {
  if (/\/mocha\.js$/.test(request.url)) {
    // Reset injected to false, if for some reason a redirect occurred and
    // the test page (including mocha.js) had to be re-requested.
    injected = false;
  }
  sendDebugMessage('onResourceRequested', request.url);
};
page.onResourceReceived = function(request) {
  if (request.stage === 'end') {
    sendDebugMessage('onResourceReceived', request.url);
  }
};

page.onInitialized = function() {
  page.evaluate(function(config) {
    window.PHANTOMJS = config ? JSON.parse(config) : {};
  }, configStr);
};

page.open(url, function(status) {
  // Only execute this code if Mocha has not yet been injected.
  if (injected) { return; }
  injected = true;
  // The window has loaded.
  if (status !== 'success') {
    // File loading failure.
    sendMessage(['done_fail', url]);
  } else {
    // Inject Mocha helper file.
    sendDebugMessage('inject', mochaHelper);
    page.injectJs(mochaHelper);
    // Because injection happens after window load, "begin" must be sent
    // manually.
    sendMessage(['begin']);
  }
});
