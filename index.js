var css = require('./css')
  , less = require('./less')

module.exports = function (opts, cb) {
  if (typeof opts === 'string') opts = {entry: opts};
  opts = opts || {}

  if (opts.entry.substr(-4) === 'less') {
    less(opts, complete)
  } else {
    css(opts, complete)
  }

  function complete (err, src) {
    if (err) throw err

    if (opts.transform) {
      cb(null, opts.transform(src))
    } else {
      cb(null, src)
    }
  }
}
