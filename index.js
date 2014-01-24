var importcss = require('rework-npm')
  , rework = require('rework')
  , vars = require('rework-vars')
  , path = require('path')
  , read = require('fs').readFileSync

module.exports = function (opts, cb) {
  opts = opts || {}
  var css = rework(read(opts.entry, 'utf8'))
  css.use(importcss(path.dirname(opts.entry)))

  // even if variable were not provided
  // use rework-vars to process default values
  css.use(vars(opts.vars))

  // utilize any custom rework plugins provided
  if (opts.plugins) {
    opts.plugins.forEach(function (plugin) {
      css.use(plugin)
    })
  }

  if (opts.transform) {
    opts.transform(css.toString(), cb)
  } else {
    cb(null, css.toString())
  }
}
