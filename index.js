'use strict'

var css = require('./css')
  , less = require('./less')
  , fs = require('fs')
  , path = require('path')
  , mkdirp = require('mkdirp')
  , writer = require('write-to-path')
  , autoprefixer = require('autoprefixer-core')

module.exports = function atomifyCSS(opts, cb) {
  if (typeof opts === 'string') opts = {entry: opts}
  if (typeof cb === 'string') opts.output = cb
  if (opts.entry) opts.entries = [opts.entry]

  if (opts.entry && opts.entry.substr(-4) === 'less') {
    less(opts, complete)
  }
  else {
    css(opts, complete)
  }

  function complete(err, src, resourcepaths) {
    var outputPath
      , outputDir
      , writeFile
      , _cb

    if (opts.transform && !err) src = opts.transform(src)
    if (opts.autoprefixer) {
      src = autoprefixer(typeof opts.autoprefixer === 'object' ? opts.autoprefixer : null).process(src).css
    }
    if (opts.output) {
      // we definitely have to write the file
      outputPath = path.resolve(process.cwd(), opts.output)
      outputDir = path.dirname(outputPath)
      writeFile = writer(outputPath, {debug: opts.debug})

      if (!fs.existsSync(outputDir)) mkdirp.sync(outputDir)

      // we might need to call a callback also
      if (typeof cb === 'function') {
        _cb = cb
        cb = function callbackWrapper(wrapperErr, wrapperSrc) {
          if (wrapperErr) return _cb(wrapperErr)

          writeFile(null, wrapperSrc)
          _cb(null, wrapperSrc, resourcepaths)
        }
      }
      else {
        cb = writeFile
      }
    }

    cb(err, src)
  }
}
