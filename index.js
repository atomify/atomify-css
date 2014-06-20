var css = require('./css')
  , less = require('./less')
  , path = require('path')
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
      var writeFile = writer(path.resolve(process.cwd(), opts.output), {debug: opts.debug})

      // we might need to call a callback also
      if (typeof cb === 'function') {
        var _cb = cb
        cb = function (err, src) {
          writeFile(err, src)
          _cb(err, src)
        }
      } else {
        cb = writeFile
      }
    }

    cb(err, src)
  }
}
