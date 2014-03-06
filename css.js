var rework = require('rework')
  , npm = require('rework-npm')
  , vars = require('rework-vars')
  , path = require('path')
  , fs = require('fs')
  , resolve = require('resolve')
  , pkg = require('package-lookup')
  , read = function (f) {
    return fs.readFileSync(f, 'utf8')
  }

module.exports = function (opts, cb) {
  opts = opts || {}

  var resolvedEntry = path.resolve(process.cwd(), opts.entry)
    , css = rework(read(resolvedEntry))

  css.use(npm({
    dir: path.dirname(resolvedEntry)
    , prefilter: prefilter
  }))

  // even if variables were not provided
  // use rework-vars to process default values
  css.use(vars(opts.variables))

  // utilize any custom rework plugins provided
  if (opts.plugins) {
    opts.plugins.forEach(function (plugin) {
      css.use(getPlugin(plugin, path.dirname(resolvedEntry)))
    })
  }

  cb(null, css.toString({
    sourcemap: opts.debug || opts.sourcemap
    , compress: opts.compress
  }))
}

function getPlugin (plugin, basedir) {
  var pluginName
    , pluginArgs
    , pluginPath

  if (typeof plugin === 'string') pluginName = plugin

  if (Array.isArray(plugin)) {
    pluginName = plugin[0]
    pluginArgs = plugin.slice(1)
  }

  pluginPath = resolve.sync(pluginName, {basedir: basedir})

  if (pluginArgs) {
    return require(pluginPath).apply(null, pluginArgs)
  } else {
    return require(pluginPath)
  }
}

function prefilter (src, filename) {
  var config = pkg.resolve(filename).atomify

  if (config && config.css && config.css.plugins) {
    var css = rework(src);
    config.css.plugins.forEach(function (plugin) {
      css.use(getPlugin(plugin, path.dirname(filename)))
    })
    return css.toString()
  }

  return src
}
