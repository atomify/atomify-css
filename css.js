var importcss = require('rework-npm')
  , rework = require('rework')
  , vars = require('rework-vars')
  , path = require('path')
  , read = require('fs').readFileSync
  , sass = require('node-sass')

module.exports = function (opts, cb) {
  opts = opts || {}

  var resolvedEntry = path.resolve(process.cwd(), opts.entry)
    , css = rework(read(resolvedEntry, 'utf8'))

  css.use(importcss({
    dir: path.dirname(resolvedEntry)
    , prefilter: prefilter
  }))

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

  cb(null, css.toString({
    sourcemap: opts.debug || opts.sourcemap
    , compress: opts.compress
  }))
}

function prefilter (src, filename) {
  if (filename.substr(-4) === 'scss') {
    return sass.renderSync({data: src})
  }
  return src
}
