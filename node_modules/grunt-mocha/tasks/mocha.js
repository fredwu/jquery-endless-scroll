// Important: You must install `temporary`: `npm install`
/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 *
 * Mocha task
 * Copyright (c) 2012 Kelly Miyashiro
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

module.exports = function(grunt) {
  // Grunt utilities.
  var task = grunt.task;
  var file = grunt.file;
  var utils = grunt.utils;
  var log = grunt.log;
  var verbose = grunt.verbose;
  var fail = grunt.fail;
  var option = grunt.option;
  var config = grunt.config;
  var template = grunt.template;
  
  // Nodejs libs.
  var fs = require('fs');
  var path = require('path');

  // External libs.
  var Tempfile = require('temporary/lib/file');
  var growl;
  
  // Growl is optional
  try {
    growl = require('growl');
  } catch(e) {
    growl = function(){};
    verbose.write('Growl not found, npm install growl for Growl support');
  }

  // Keep track of the last-started module, test and status.
  var currentModule, currentTest, status;
  // Keep track of the last-started test(s).
  var unfinished = {};

  // Allow an error message to retain its color when split across multiple lines.
  function formatMessage(str) {
    return String(str).split('\n').map(function(s) { return s.magenta; }).join('\n');
  }

  // Keep track of failed assertions for pretty-printing.
  var failedAssertions = [];
  function logFailedAssertions() {
    var assertion;
    // Print each assertion error.
    while (assertion = failedAssertions.shift()) {
      verbose.or.error(assertion.testName);
      log.error('Message: ' + formatMessage(assertion.message));
      if (assertion.actual !== assertion.expected) {
        log.error('Actual: ' + formatMessage(assertion.actual));
        log.error('Expected: ' + formatMessage(assertion.expected));
      }
      if (assertion.source) {
        log.error(assertion.source.replace(/ {4}(at)/g, '  $1'));
      }
      log.writeln();
    }
  }

  // Handle methods passed from PhantomJS, including Mocha hooks.
  var phantomHandlers = {
    // Mocha hooks.
    suiteStart: function(name) {
      unfinished[name] = true;
      currentModule = name;
    },
    suiteDone: function(name, failed, passed, total) {
      delete unfinished[name];
    },
    testStart: function(name) {
      currentTest = (currentModule ? currentModule + ' - ' : '') + name;
      verbose.write(currentTest + '...');
    },
    testFail: function(name, result) {
        result.testName = currentTest;
        failedAssertions.push(result);
    },
    testDone: function(title, state) {
      // Log errors if necessary, otherwise success.
      if (state == 'failed') {
        // list assertions
        if (option('verbose')) {
          log.error();
          logFailedAssertions();
        } else {
          log.write('F'.red);
        }
      } else {
        verbose.ok().or.write('.');
      }
    },
    done: function(failed, passed, total, duration) {
      var nDuration = parseFloat(duration) || 0;
      status.failed += failed;
      status.passed += passed;
      status.total += total;
      status.duration += Math.round(nDuration*100)/100;
      // Print assertion errors here, if verbose mode is disabled.
      if (!option('verbose')) {
        if (failed > 0) {
          log.writeln();
          logFailedAssertions();
        } else {
          log.ok();
        }
      }
    },
    // Error handlers.
    done_fail: function(url) {
      verbose.write('Running PhantomJS...').or.write('...');
      log.error();
      grunt.warn('PhantomJS unable to load "' + url + '" URI.', 90);
    },
    done_timeout: function() {
      log.writeln();
      grunt.warn('PhantomJS timed out, possibly due to a missing Mocha run() call.', 90);
    },
    
    // console.log pass-through.
    // console: console.log.bind(console),
    // Debugging messages.
    debug: log.debug.bind(log, 'phantomjs')
  };

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('mocha', 'Run Mocha unit tests in a headless PhantomJS instance.', function() {
    // Get files as URLs.
    var urls = file.expandFileURLs(this.file.src);
    // Get additional configuration
    var config = {};
    
    if (utils.kindOf(this.data) === 'object') {
      config = utils._.clone(this.data);
      delete config.src;
    }

    var configStr = JSON.stringify(config);
    verbose.writeln('Additional configuration: ' + configStr);
    
    // This task is asynchronous.
    var done = this.async();

    // Reset status.
    status = {failed: 0, passed: 0, total: 0, duration: 0};

    // Process each filepath in-order.
    utils.async.forEachSeries(urls, function(url, next) {
      var basename = path.basename(url);
      verbose.subhead('Testing ' + basename).or.write('Testing ' + basename);

      // Create temporary file to be used for grunt-phantom communication.
      var tempfile = new Tempfile();
      // Timeout ID.
      var id;
      // The number of tempfile lines already read.
      var n = 0;

      // Reset current module.
      currentModule = null;

      // Clean up.
      function cleanup() {
        clearTimeout(id);
        tempfile.unlink();
      }

      // It's simple. As Mocha tests, assertions and modules begin and complete,
      // the results are written as JSON to a temporary file. This polling loop
      // checks that file for new lines, and for each one parses its JSON and
      // executes the corresponding method with the specified arguments.
      (function loopy() {
        // Disable logging temporarily.
        log.muted = true;
        // Read the file, splitting lines on \n, and removing a trailing line.
        var lines = file.read(tempfile.path).split('\n').slice(0, -1);
        // Re-enable logging.
        log.muted = false;
        // Iterate over all lines that haven't already been processed.
        var done = lines.slice(n).some(function(line) {
          // Get args and method.
          var args = JSON.parse(line);
          var method = args[0];
          // Execute method if it exists.
          if (phantomHandlers[method]) {
            args.shift();
            phantomHandlers[method].apply(null, args);
          } else {
            // Otherwise log read data
            verbose.writeln("\n" + args.join(", "));
          }
          // If the method name started with test, return true. Because the
          // Array#some method was used, this not only sets "done" to true,
          // but stops further iteration from occurring.
          return (/^done/).test(method);
        });

        if (done) {
          // All done.
          cleanup();
          next();
        } else {
          // Update n so previously processed lines are ignored.
          n = lines.length;
          // Check back in a little bit.
          id = setTimeout(loopy, 100);
        }
      }());

      // Launch PhantomJS.
      grunt.helper('phantomjs', {
        code: 90,
        args: [
          // The main script file.
          task.getFile('mocha/phantom-mocha-runner.js'),
          // The temporary file used for communications.
          tempfile.path,
          // The Mocha helper file to be injected.
          // task.getFile('../test/run-mocha.js'),
          task.getFile('mocha/mocha-helper.js'),
          // URL to the Mocha .html test file to run.
          url,
          // Additional configuration
          configStr,
          // PhantomJS options.
          '--config=' + task.getFile('mocha/phantom.json')
        ],
        done: function(err) {
          if (err) {
            cleanup();
            done();
          }
        },
      });
    }, function(err) {
      // All tests have been run.

      // Log results.
      if (status.failed > 0) {
        growl(status.failed + ' of ' + status.total + ' tests failed!', {
          image: __dirname + '/mocha/error.png',
          title: 'Tests Failed',
          priority: 3
        });
        grunt.warn(status.failed + '/' + status.total + ' assertions failed (' +
          status.duration + 's)', Math.min(99, 90 + status.failed));
      } else {
        growl('All Clear: ' + status.total + ' tests passed', {
          title: 'Tests Passed',
          image: __dirname + '/mocha/ok.png'
        });
        verbose.writeln();
        log.ok(status.total + ' assertions passed (' + status.duration + 's)');
      }

      // All done!
      done();
    });
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  grunt.registerHelper('phantomjs', function(options) {
    return utils.spawn({
      cmd: 'phantomjs',
      args: options.args
    }, function(err, result, code) {
      if (!err) { return options.done(null); }
      // Something went horribly wrong.
      verbose.or.writeln();
      log.write('Running PhantomJS...').error();
      if (code === 127) {
        log.errorlns(
          'In order for this task to work properly, PhantomJS must be ' +
          'installed and in the system PATH (if you can run "phantomjs" at' +
          ' the command line, this task should work). Unfortunately, ' +
          'PhantomJS cannot be installed automatically via npm or grunt. ' +
          'See the grunt FAQ for PhantomJS installation instructions: ' +
          'https://github.com/cowboy/grunt/blob/master/docs/faq.md'
        );
        grunt.warn('PhantomJS not found.', options.code);
      } else {
        result.split('\n').forEach(log.error, log);
        grunt.warn('PhantomJS exited unexpectedly with exit code ' + code + '.', options.code);
      }
      options.done(code);
    });
  });

};
