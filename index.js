var importcss = require('rework-npm')
  , rework = require('rework')
  , variables = require('rework-vars')
  , read = require('fs').readFileSync

module.exports = function (opts, cb) {
  opts = opts || {}
  var css = rework(read(opts.entry, 'utf8'))
  css.use(importcss(opts.cwd))
  if (opts.variables) {
    css.use(variables(opts.variables))
  }
  if (opts.transform) {
    otps.transform(file, cb)
  } else {
    cb(null, css.toString())
  }
}
