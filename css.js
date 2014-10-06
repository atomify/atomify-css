var rework = require('rework')
  , npm = require('rework-npm')
  , bower = require('rework-bower')
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
    var entries = []
    
    opts.entries.forEach(function (entry) {
        var resolvedEntry = resolveFilePath(entry)

        entries.push(applyRework(opts, resolvedEntry))
    })

    return entries.join(opts.compress ? '' : '\n')
}

function applyRework (opts, resolvedEntry) {
    var css = rework(read(resolvedEntry), {source: resolvedEntry})
        , dirName = path.dirname(resolvedEntry)
        , pkgmgr = opts.bower ? bower : npm

    css.use(pkgmgr({
        root: dirName,
        prefilter: prefilter
    }))

    applyReworkVars(css, opts)
    applyReworkAssets (css, opts, dirName)
    applyReworkPlugins(css, opts, dirName)

    return css.toString({
        sourcemap: opts.debug || opts.sourcemap
        , compress: opts.compress
    })
}

function applyReworkAssets (css, opts, dirName) {
    if (opts.assets) {
        css.use(assets({
            src: dirName
            , dest: opts.assets.dest || ''
            , prefix: opts.assets.prefix || ''
            , retainName: opts.assets.retainName || ''
        }))
    }
}

function applyReworkPlugins(css, opts, dirName) {
    if (opts.plugins) {
        opts.plugins.forEach(function (plugin) {
            css.use(getPlugin(plugin, dirName))
        })
    }
}

function applyReworkVars(css, opts) {
    if (typeof opts.variables === 'string') {
        var variablesFilePath = resolveFilePath(opts.variables)
        opts.variables = readJSON(variablesFilePath)
    }
    // even if variables were not provided
    // use rework-vars to process default values
    css.use(vars({ map: opts.variables }))
}

function resolveFilePath(filePath) {
    return path.resolve(process.cwd(), filePath)
}

function readJSON (filepath) {
    var src = read(filepath)

    try {
        return JSON.parse(src)
    } catch(e) {
        throw new Error('Unable to parse "' + filepath + '" file (' + e.message + ').', e)
    }
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
