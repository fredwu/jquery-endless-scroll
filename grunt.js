module.exports = function(grunt) {
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    min: {
      dist: {
        src: ['js/<%= pkg.name %>.js'],
        dest: 'js/<%= pkg.name %>.min.js'
      }
    },
    watch: {
      coffee: {
        files: ['src/*.coffee', 'test/*.coffee'],
        tasks: 'coffee'
      },
      tests: {
        files: ['js/*.js', 'test/*.js'],
        tasks: 'mocha'
      }
    },
    coffee: {
      app: {
        src: ['src/*.coffee'],
        dest: 'js',
        options: {
          bare: true
        }
      },
      tests: {
        src: ['test/*.coffee'],
        dest: 'test/',
        options: {
          bare: false
        }
      }
    },
    mocha: {
      tests: ['test/tests-jquery.html', 'test/tests-zepto.html']
    }
  });

  grunt.loadNpmTasks('grunt-coffee');
  grunt.loadNpmTasks('grunt-mocha');

  grunt.registerTask('test', 'mocha');
  grunt.registerTask('default', 'coffee mocha');
};
