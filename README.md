atomify-css
===============

Atomify your CSS - Use Node's resolution patterns to combine and process CSS or LESS from npm modules. Uses [rework](https://github.com/reworkcss/rework) for CSS and [less](https://github.com/less/less.js) for LESS.

### Description

Wouldn't it be nice if npm modules could provide their own CSS as part of their package? And then you could combine them into a dependency tree to build big sets of styles out of lots of small sets of styles like you do with JS? That's what atomify-css does.

### Method

atomify-css takes an `opts` object and a `callback`.

The `opts` object must contain an `entry` key that is the relative path (from `process.cwd()`) to the entry file. If `opts.entry` is a CSS file it will be processed with Rework. If it's a LESS file it will be processed with less.

The `callback` will be called with an (optional) `error` as it's first argument and the atomified CSS bundle as the second argument.

When using Rework, you can also provide `opts.variables` (a hash) and `opts.plugins` (an array) properties. `opts.variables` will be passed to [rework-vars](https://npmjs.org/package/rework-vars), and each item in `opts.plugins` will be passed to the `use()` method of Rework.

If you want to transform the bundled output before it is returned to `opts.callback` you can provide an `opts.transform` function to do so.

### Examples

#### Rework

```
// index.js

var css = require('atomify-css')

var opts = {
  entry: __dirname + '/entry.css'
, variables: {
    bg: 'black'
  }
}

css(opts, function (err, src) {
  // do something with the src
})
```

```
/* entry.css */

@import "./global.css";
@import "combobox";
@import "./inputs.css";

body {
  background: var(bg);
}
```

### Install

```
npm install atomify-css
```
