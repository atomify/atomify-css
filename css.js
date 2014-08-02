var rework = require('rework')
  , npm = require('rework-npm')
  , vars = require('rework-vars')
  , assets = require('rework-assets')
  , path = require('path')
  , fs = require('fs')
  , events = require('events')
  , resolve = require('resolve')
  , pkg = require('package-lookup')
  , read = function (f) {
    return fs.readFileSync(f, 'utf8')
  }

var ctor = module.exports = function (opts, cb) {
  opts = opts || {}

  var src
  try {
    src = bundle(opts)
  } catch (err) {
    return process.nextTick(function () { cb(err) })
  }

  process.nextTick(function () { cb(null, src) })
}

ctor.emitter = new events.EventEmitter()

function bundle (opts) {
  var resolvedEntry = path.resolve(process.cwd(), opts.entry)
    , css = rework(read(resolvedEntry), {source: resolvedEntry})

  css.use(npm({
    prefilter: prefilter
  }))

  // even if variables were not provided
  // use rework-vars to process default values
  css.use(vars(opts.variables))

  if (opts.assets) {
    css.use(assets({
      src: path.dirname(resolvedEntry)
      , dest: opts.assets.dest || ''
      , prefix: opts.assets.prefix || ''
    }))
  }

  // utilize any custom rework plugins provided
  if (opts.plugins) {
    opts.plugins.forEach(function (plugin) {
      css.use(getPlugin(plugin, path.dirname(resolvedEntry)))
    })
  }

  return css.toString({
    sourcemap: opts.debug || opts.sourcemap
    , compress: opts.compress
  })
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
  var config = pkg.resolve(filename)

  ctor.emitter.emit('file', filename)

  if (config && config.atomify && config.atomify.css && config.atomify.css.plugins) {
    var css = rework(src);
    config.atomify.css.plugins.forEach(function (plugin) {
      css.use(getPlugin(plugin, path.dirname(filename)))
    })
    return css.toString()
  }

  return src
}
