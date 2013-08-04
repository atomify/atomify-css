var npmcss     = require('npm-css')
  , rework     = require('rework')
  , variables  = require('rework-vars')
  , path       = require('path')

module.exports = function (opts, cb) {
  var file = npmcss(path.join(process.cwd(), opts.entry))
  var css = rework(file)
  css.use(variables(opts.variables))
  cb(null, css.toString())
}
