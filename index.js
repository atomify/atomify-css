var css = require('./css')
  , less = require('./less')
  , path = require('path')
  , writer = require('write-to-path')

module.exports = function (opts, cb) {
  if (typeof opts === 'string') opts = {entry: opts};
  if (typeof cb === 'string') opts.output = cb;
  opts = opts || {}

  if (opts.entry.substr(-4) === 'less') {
    less(opts, complete)
  } else {
    css(opts, complete)
  }

  function complete (err, src) {
    if (err) throw err

    if (opts.transform) src = opts.transform(src)

    if (opts.output) {
      writer(path.resolve(process.cwd(), opts.output), {debug: opts.debug})(null, src)
    } else {
      cb(null, src)
    }
  }
}
