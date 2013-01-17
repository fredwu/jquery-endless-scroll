var grunt = require('grunt'),
    fs = require('fs'),
    path = require('path');

fs.existsSync = fs.existsSync ? fs.existsSync : path.existsSync;

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var src = 'test/fixtures/hello_world.coffee';
var dupExtSrc = 'test/fixtures/duplicate_extension.js.coffee';
var jsSrc = 'test/fixtures/js_hello_world.js';
var outputFolder = 'tmp/js';
var expectedJSFile = 'test/fixtures/hello_world.js';

exports['coffee'] = {
  setUp: function(done) {
    done();
  },

  tearDown: function(done) {
    /** A simple rm -rf function **/
    var rmFiles = function(filesToDelete) {
      function helper(filesToDelete) {
        if (filesToDelete.length === 0) {
          return;
        }

        var file = filesToDelete.shift();
        var stats = fs.statSync(file);
        if (stats.isDirectory()) {
          var subfiles = fs.readdirSync(file);
          for (var i = 0; i < subfiles.length; i++) {
            filesToDelete.push(path.join(file, subfiles[i]));
          }
        } else {
          fs.unlinkSync(file);
          if (fs.readdirSync(path.dirname(file)).length === 0) {
            fs.rmdirSync(path.dirname(file));
          }
        }
        helper(filesToDelete);
      }
      
      helper(filesToDelete);
    };

    if (fs.existsSync(expectedJSFile)) {
      fs.unlinkSync(expectedJSFile);
    }

    if (fs.existsSync(outputFolder)) {
      rmFiles([outputFolder]);
    }
    done();
  },

  'helper': function(test) {
    test.expect(2);

    grunt.helper('coffee', [src], outputFolder);
    test.equal(grunt.file.read(outputFolder + '/hello_world.js'),
               '\nconsole.log("Hello CoffeeScript!");\n',
               'it should compile the coffee');

    grunt.helper('coffee', [src], outputFolder, { bare:false });
    test.equal(grunt.file.read(outputFolder + '/hello_world.js'),
               '(function() {\n\n  console.log("Hello CoffeeScript!");\n\n}).call(this);\n',
               'it should compile the coffee');

    test.done();
  },

  'helper-nodest': function(test) {
    test.expect(1);
    grunt.helper('coffee', [src]);
    test.equal(grunt.file.read(expectedJSFile),
               '\nconsole.log("Hello CoffeeScript!");\n',
               'it should compile the coffee');
    test.done();
  },

  'helper-dirs': function(test) {
    test.expect(1);
    grunt.helper('coffee', [src], outputFolder, { preserve_dirs:true });
    test.equal(grunt.file.read(path.join(outputFolder, expectedJSFile)),
               '\nconsole.log("Hello CoffeeScript!");\n',
               'it should compile the coffee');
    test.done();
  },

  'helper-dirs-base': function(test) {
    var base = 'test';
    test.expect(1);
    grunt.helper('coffee', 
                 [src], 
                 outputFolder, 
                 { 
                   preserve_dirs:true, 
                   base_path:base 
                 });
    test.equal(
      grunt.file.read(
        path.join(outputFolder, expectedJSFile.replace(new RegExp('^'+base), ''))
      ),
      '\nconsole.log("Hello CoffeeScript!");\n',
      'it should compile the coffee');
    test.done();
  },

  'helper-extension': function(test) {
    test.expect(1);
    grunt.helper('coffee', [src], outputFolder, {}, '.coffee.js');
    test.ok(fs.existsSync(path.join(outputFolder, "hello_world.coffee.js")));
    test.done();
  },

  'helper-duplicate-extension': function(test) {
    test.expect(1);
    grunt.helper('coffee', [dupExtSrc], outputFolder, {});
    test.ok(fs.existsSync(path.join(outputFolder, "duplicate_extension.js")));
    test.done();
  },

  'helper-js-file-passthrough': function(test) {
    test.expect(2);
    grunt.helper('coffee', [jsSrc], outputFolder, {preserve_dirs: true});
    test.ok(fs.existsSync(path.join(outputFolder, jsSrc)));
    test.equal(
      grunt.file.read(path.join(outputFolder, jsSrc)),
      'console.log("Hello world!");\n',
      'it should just copy javascript files'
    );
    test.done();
  }
};
