/*global config:true, task:true*/
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

    grunt.initConfig({
        options: {
            testFiles: [
                'js/model/**/*.js',
                'js/collection/**/*.js',
                'js/router/**/*.js',
                'js/view/**/*.js',
                'js/libs/acme/**/*.js'
            ]
        },
        test: {
            files: ['test/**/*.js']
        },
        watch: {
            // Just for example:
            // testAdmin: {
            //     files: [
            //         '<config:options.testFiles>',
            //         'test/admin/specs/*.js'
            //     ],
            //     tasks: 'mocha'
            // },
            
            // If you want to watch files and run tests automatically on change
            test: {
                files: [ 'js/**/*.js', 'test/spec/**/*.js' ],
                tasks: 'mocha'
            }
        },
        mocha: {
            // runs all html files (except test2.html) in the test dir
            // In this example, there's only one, but you can add as many as
            // you want. You can split them up into different groups here
            // ex: admin: [ 'test/admin.html' ]
            all: [ 'test/**/!(test2).html' ],
            
            // Runs 'test/test2.html' with specified mocha options.
            // This variant auto-includes 'mocha-helper.js' so you do not have
            // to include it in your HTML spec file. Instead, you must add an
            // environment check before you run `mocha.run` in your HTML.
            test2: {

                // Test files
                src: [ 'test/test2.html' ],

                // mocha options
                mocha: {
                    ignoreLeaks: false,
                    grep: 'food'
                },

                // Indicates whether 'mocha.run()' should be executed in 
                // 'mocha-helper.js'
                run: true
            }
        }
    });
    
    // @DEBUG Remove this line in your grunt file, this is just for testing
    grunt.loadTasks('../tasks');

    // Alias 'test' to 'mocha' so you can run `grunt test`
    task.registerTask('test', 'mocha');
    
    // Default task.
    task.registerTask('default', 'mocha');

    // run `npm install grunt-mocha` in project root dir and uncomment this
    // grunt.loadNpmTasks('grunt-mocha');
};
