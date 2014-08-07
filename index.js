var css = require('./css')
  , less = require('./less')
  , fs = require('fs')
  , path = require('path')
  , mkdirp = require('mkdirp')
  , writer = require('write-to-path')

module.exports = function (opts, cb) {
  if (typeof opts === 'string') opts = {entry: opts};
  if (typeof cb === 'string') opts.output = cb;

  if (opts.entry.substr(-4) === 'less') {
    less(opts, complete)
  } else {
    css(opts, complete)
  }

  function complete (err, src) {
    if (opts.transform && !err) src = opts.transform(src)

    if (opts.output) {
      // we definitely have to write the file
      var outputPath = path.resolve(process.cwd(), opts.output)
        , outputDir = path.dirname(outputPath)
        , writeFile = writer(outputPath, {debug: opts.debug})

      if (!fs.existsSync(outputDir)) mkdirp.sync(outputDir)

      // we might need to call a callback also
      if (typeof cb === 'function') {
        var _cb = cb
        cb = function (err, src) {
          if (err) return _cb(err)

          writeFile(null, src)
          _cb(null, src)
        }
      } else {
        cb = writeFile
      }
    }

    cb(err, src)
  }
}
