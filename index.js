var npmcss     = require('npm-css')
  , rework     = require('rework')
  , variables  = require('rework-vars')
  , path       = require('path')

module.exports = function (opts, cb) {
  opts = opts || {}
  var file = npmcss(path.join(process.cwd(), opts.entry))
  var css = rework(file)
  if (opts.variables) {
    css.use(variables(opts.variables))
  }
  if (opts.transform) {
    otps.transform(file, cb)
  } else {
    cb(null, css.toString())
  }
}
