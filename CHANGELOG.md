# Changelog

## 3.3.5
* fix: LESS options can now take additional roots. #47

## 3.3.4
* internal: removed undocumented resourcePaths feature. #46

## 3.3.3
* fix: use postscss to process autoprefixer. This fixes a deprecation warning from autoprefixer.
* internal: move test file into test dir
* internal: add eslint


## 3.3.2
* fix: don't run autoprefixer if there's an error. This makes error output more clear.

## 3.3.0
* add css & assets watch mode for livereload (@serapath)
* add autoprefixer (@serapath)
* code style cleanup
* now testing on iojs and node 0.12

## 3.2.1
* update dependencies
* fix some wonky tests
* tests now error if the callback throws an error

## 3.2.0
* Adds support for multiple entry files.
* Adds support for specifying variables with a JSON file

## 3.1.0
* Adds support for bower.

## 3.0.0
* adds support for the new css var syntax (`--color: red` vs. the old `var-color: red`)

