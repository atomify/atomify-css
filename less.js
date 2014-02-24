var less = require('npm-less/less')
  , path = require('path')

module.exports = function (opts, cb) {
  less(path.resolve(process.cwd(), opts.entry), function (err, output) {
    if (err) throw err

    cb(null, output.toCSS(opts))
  })
}
