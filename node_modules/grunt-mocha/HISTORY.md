# 0.1.7
* Fix bad legacy mocha check for mocha < 1.4.2 (rohni)

# 0.1.6
* Add ability to pass mocha config options (grep, etc) via grunt task config. (gamtiq)
* Add option to not include `mocha-spec-helper.js` and auto-inject/run with the `run` config option. Note: Still not required for AMD. This requires an if-statement in your HTML spec to check for PhantomJS environment, it's either that or include the helper. See `example/test2.html`. (gamtiq)

# 0.1.5
* Fix total duration when testing multiple html spec files in a single task. (chevalric)

# 0.1.4
* **Critical fix:** Compatibility with Mocha 1.4.2 (iammerick)
    * If you use `mocha-helper.js` for non-AMD and you want to use Mocha >1.4.2, you replace it with the one in this update.

# 0.1.3
* Remove grunt from deps

# 0.1.2
* Added example for non-AMD usage. Modified mocha-helper to be included in page (optional)
* Added duration

# 0.1.1

* Consistency
* Make growl optional

# 0.1.0

init