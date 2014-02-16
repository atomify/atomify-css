var importcss = require('rework-npm')
  , rework = require('rework')
  , vars = require('rework-vars')
  , path = require('path')
  , read = require('fs').readFileSync

module.exports = function (opts, cb) {
  opts = opts || {}

  var css = rework(read(opts.entry, 'utf8'))
  css.use(importcss(path.dirname(opts.entry)))

  // even if variables were not provided
  // use rework-vars to process default values
  css.use(vars(opts.variables))

  // utilize any custom rework plugins provided
  if (opts.plugins) {
    opts.plugins.forEach(function (plugin) {
      if (typeof plugin === 'string') plugin = require(plugin)
      css.use(plugin)
    })
  }

  cb(null, css.toString())
}
