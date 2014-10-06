atomify-css
===============

[![Build Status](https://travis-ci.org/atomify/atomify-css.svg?branch=master)](https://travis-ci.org/atomify/atomify-css)

Atomic CSS - Reusable front-end styling using Rework, plugins, and Node's resolve algorithm

## Description

atomify-css extends Node's well established practice of creating small, reusable modules to CSS by allowing npm (and other) modules to include style data as part of their packages. Basically, it makes `@import` work like `require()`.

Using [Rework](https://github.com/reworkcss/rework) for CSS and [less](https://github.com/less/less.js) for LESS, atomify-css brings a [dependency graph to your CSS](http://techwraith.com/your-css-needs-a-dependency-graph-too.html).

### Default plugins

 * [rework-npm](https://github.com/conradz/rework-npm) - Brings Node's resolve behavior to CSS, making `@import` work like `require()` (e.g. named modules)
 * [rework-vars](https://github.com/reworkcss/rework-vars) - Provides W3C-style CSS variables syntax for CSS files
 * [npm-less](https://github.com/Raynos/npm-less) - Adds support for Node-style resolution, making `@import` work like `require()` for LESS files.

## API

In its default form, atomify-css takes an `opts` object and a `callback` function.

While you may use atomify-css with CSS or LESS, you cannot combine them in the same workflow. The workaround for this limitation is to preprocess everything to CSS before passing to atomify-css.

### opts

**opts.entry** or **opts.entries* - Path or paths that will be provided to Rework as the entry point. For convenience, you may simply provide a string in place of the `opts` object, which will be treated as the `entry` property. The path will be resolved relative to `process.cwd()`.

**opts.transform** - A synchronous transformation function that will be run as the final processing step. String in, string out.

**opts.output** - If you simply want your bundle written out to a file, provide the path in this property. Note that your `callback` will NOT be called if this property is present. Path will be resolved relative to `process.cwd()`.

### opts for CSS workflows

**opts.variables** - An object hash or a JSON file path that will be provided to [rework-vars](https://github.com/reworkcss/rework-vars) to replace any vars defined in your CSS.

**opts.plugins** - An array of Rework plugins to `use()` in addition to the defaults listed above.

**opts.debug** or **opts.sourcemap** - Passed to the `toString()` method of Rework to generate source maps if `true`. Also provides additional CLI output, if applicable.

**opts.compress** - Compress (remove whitespace from) CSS output.

**opts.assets** - One of the challenges with writing truly modular code is that your stylesheets often refer to assets that need to be accessible from your final bundle. Configuring this option solves that problem by detecting asset paths in your CSS files, copying the assets to a new location, and rewriting the references to them to use the new paths. Paths in `url()` statements will be processed according to your configuration.

The processing is configured using two sub-properties of opts.assets: `dest` and `prefix`. The `dest` field determines the location files will be copied to, relative to `process.cwd()`, and `prefix` specifies what will be prepended to the new file names in the rewritten `url()` calls. The filenames are generated from a hash of the assets themselves, so you don't have to worry about name collisions.

To demonstrate, see the following example.

```js
// config
{
  entry: './entry.css',
  output: 'dist/bundle.css',
  ...
  assets: {
    dest: 'dist/assets',
    prefix: 'assets/'
  }
}
```

```css
background: url("src/images/background.jpg");
```

becomes

```css
background: url("assets/4314d804f81c8510.jpg");
```

and a copy of background.jpg will now exist at `dist/assets/4314d804f81c8510.jpg`

### opts for LESS workflows

The entire `opts` object is passed to the `toCSS()` method of the LESS Parser, so any options it supports can be used.

### callback

Standard bundle callback with `cb(err, src)` signature. Not called if `opts.output` is specifed. If `callback` is provided as a string rather than function reference it will be used as the `opts.output` file path.

## package.json config

[Configuring atomify in package.json](https://github.com/Techwraith/atomify#packagejson-config) is pretty straightforward, but there is a bit of nuance in how you specify custom Rework plugins. There are a few different ways plugins can be instantiated, depending on the author's preference, but we support them all in a pretty straightforward manner.

We have essentially implemented the [transformKey syntax from module-deps](https://github.com/substack/module-deps#packagejson-transformkey), meaning plugin configuration closely mimics transform configuration in Browserify. The following list shows how keys in your `atomify.css.plugins` array will be mapped to code.

 * `"rework-default-unit"` maps to `require('rework-default-unit')`
 * `["rework-clone"]` maps to `require('rework-clone')()`
 * `["rework-plugin-inline", "src/assets"]` maps to `require('rework-plugin-inline')('src/assets')`

In plain English, a string will simply be passed to `require()`, while an array will pass the first element to `require()` and call the resulting function with any remaining elements from the array.

## Examples

```css
/* entry.css */

@import "./global.css";
@import "./inputs.css";
@import "auth-form";

body {
  background: var(bg);
}
```

```js
// build.js
var css = require('atomify-css')

var opts = {
  entry: './entry.css'
, debug: true // default: `false`
}

css(opts, function (err, src) {
  // do something with the src
})
```

OR

```js
var css = require('atomify-css')

css('./entry.css', './bundle.css')
```

## Install

```bash
npm install atomify-css
```
