var less = require('npm-less/less')

module.exports = function (opts, cb) {
  opts = opts || {}

  less(opts.entry, function (err, output) {
    if (err) throw err

    cb(null, output.toCSS())
  })
}
