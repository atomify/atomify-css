var css = require('./css')
  , less = require('./less')
  , sass = require('./sass')
  , path = require('path')
  , writer = require('write-to-path')

module.exports = function (opts, cb) {
  if (typeof opts === 'string') opts = {entry: opts};
  if (typeof cb === 'string') opts.output = cb;

  if (opts.entry.substr(-4) === 'less') {
    less(opts, complete)
  } else if (opts.entry.substr(-4) === 'scss') {
    sass(opts, complete)
  } else {
    css(opts, complete)
  }

  function complete (err, src) {
    if (err && opts.output) throw err
    if (err) return cb(err)

    if (opts.transform) src = opts.transform(src)

    if (opts.output) {
      writer(path.resolve(process.cwd(), opts.output), {debug: opts.debug})(null, src)
    } else {
      cb(null, src)
    }
  }
}
