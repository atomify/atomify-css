atomify-css
===============

Atomic CSS - Reusable front-end styling using Rework, plugins, and Node's resolve algorithm

## Description

atomify-css extends Node's well established practice of creating small, reusable modules to CSS by allowing npm (and other) modules to include style data as part of their packages. Basically, it makes `@import` work like `require()`.

Using [Rework](https://github.com/reworkcss/rework) for CSS and [less](https://github.com/less/less.js) for LESS, atomify-css brings a [dependency graph to your CSS](http://techwraith.com/your-css-needs-a-dependency-graph-too.html).

### Default Rework plugins

 * [rework-npm](https://github.com/conradz/rework-npm) - Brings Node's resolve behavior to CSS, making `@import` work like `require()` (e.g. named modules)
 * [rework-vars](https://github.com/reworkcss/rework-vars) - Provides W3C-style CSS variables syntax for CSS files
 * [npm-less](https://github.com/Raynos/npm-less) - Adds support for Node-style resolution, making `@import` work like `require()` for LESS files.

## API

In its default form, atomify-css takes an `opts` object and a `callback` function.

While you may use atomify-css with CSS or LESS, you cannot combine the two at this time. atomify-css determines which technology you are using by examining the file extension of the entry file you provide.

### opts 

**opts.entry** - Path that will be provided to Rework as the entry point. For convenience, you may simply provide a string in place of the `opts` object, which will be treated as the `entry` property. The path will be resolved relative to `process.cwd()`.

**opts.transform** - A synchronous transformation function that will be run as the final processing step. String in, string out.

**opts.output** - If you simply want your bundle written out to a file, provide the path in this property. Note that your `callback` will NOT be called if this property is present. Path will be resolved relative to `process.cwd()`.

### opts for CSS workflows

**opts.variables** - An object hash that will be provided to [rework-vars](https://github.com/reworkcss/rework-vars) to replace any vars defined in your CSS.

**opts.plugins** - An array of Rework plugins to `use()` in addition to the defaults listed above. If provided as a string, the plugin name will be passed to `require()` and the result passed to `use()`.

**opts.debug** or **opts.sourcemap** - Passed to the `toString()` method of Rework to generate source maps if `true`. Also provides additional CLI output, if applicable.

**opts.compress** - Compress (remove whitespace from) CSS output.

### opts for LESS workflows

The entire `opts` object is passed to the `toCSS()` method of the LESS Parser, so any options it supports can be used.

### callback

Standard bundle callback with `cb(err, src)` signature. Not called if `opts.output` is specifed. If `callback` is provided as a string rather than function reference it will be used as the `opts.output` file path.

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