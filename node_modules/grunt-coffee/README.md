[![build status](https://secure.travis-ci.org/avalade/grunt-coffee.png)](http://travis-ci.org/avalade/grunt-coffee)
# grunt-coffee

JavaScripts your Coffee

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-coffee`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-coffee');
```

[grunt]: https://github.com/cowboy/grunt
[getting_started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md

## Documentation
You'll need to install `grunt-coffee` first:

    npm install grunt-coffee

Then modify your `grunt.js` file by adding the following line:

    grunt.loadNpmTasks('grunt-coffee');

Then add some configuration for the plugin like so:

    grunt.initConfig({
        ...
        coffee: {
          app: {
            src: ['path/to/coffee/files/*.coffee'],
            dest: 'where/you/want/your/js/files',
            options: {
                bare: true
            }
          }
        },
        ...
    });

Then just run `grunt coffee` and enjoy!

Grunt Coffee will, by default, run coffee with the `--bare` flag set.
If you want to run it with the top level variable safety, make sure
you set your options to:

    options: {
        bare: false
    }

If you have `dest` path and want to preserve the directory structure of your coffee files, pass the `preserve_dirs` option.

    options: {
        preserve_dirs: true
    }

Also, if you just want to preserve the directory structure, starting from a base path, pass the `base_path` option.

    options: {
        preserve_dirs: true,
        base_path: 'path/to'
    }

This will create the files under `where/you/want/your/js/files/coffee/files/`.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][grunt].

## Release History
0.0.6 - addressed when Javascript files are included in the src matcher, thanks [Enleur](https://github.com/Enleur) and [brewster1134](https://github.com/brewster1134)

0.0.5 - added `base_path` option, thanks
[siriux](https://github.com/siriux) and
[William](https://github.com/wlepinski).

0.0.4 - added preservation of directory structure, thanks
[Kevin](https://github.com/rockwood).  Also added a unique copy of the
options for each call to the helper, thanks [Ken](https://github.com/elfsternberg).

0.0.3 - added relative compilation and compound file suffixes, thanks
[Pete](https://github.com/petebacondarwin).  Also added real error
messages, thanks [Tim](https://github.com/timoxley)

0.0.2 - added the options object, thanks
[Derek](https://github.com/dlindahl)!

0.0.1 - The bare minimum necessary... don't expect it to work

## License
Copyright (c) 2012 Aaron D. Valade
Licensed under the MIT license.
