atomify-css
===============

Atomify your css - use css from npm modules and run the result through rework.

### Description

You want to use node modules with css on the front-end. Atomify-css helps you do that.

### Method

atomify-css takes an `opts` object and a `callback`.

The `opts` object must contain an `entry` key that is the relative path (from `process.cwd()`) to the entry file for atomify.

The `callback` will be called with an (optional) `error` as it's first argument and atomified `source`.

### Examples

#### Rework
index.js
```js
var css = require('atomify-css')

var opts = {
  entry: './entry.css'
, variables: {
    bg: 'black'
  }
}

css(opts, function (err, src) {

  // do something with the src

})
```
#### Stylus
```js
var css = require('atomify-css')
  , stylus = require('stylus')

var opts = {
  entry: './entry.css'
, transform: function (str, done) {
    stylus.render(str, done)
  }
}

css(opts, function (err, src) {

  // do something with the src

})
```

entry.css
```css
@import "./global.css";
@import "combobox";
@import "./inputs.css";

body {
  background: var(bg);
}
```

### Install

Installing via npm is easy:

```bash
npm install atomify-css
```
