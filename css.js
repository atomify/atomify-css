'use strict'

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
  , read = function read(f) {
    return fs.readFileSync(f, 'utf8')
  }
  , resourcePaths = {cssfiles: [], assetfiles: []}
  , ctor

ctor = module.exports = function useRework(opts, cb) {
  var src

  opts = opts || {}

  try {
    src = bundle(opts)
  }
  catch (err) {
    return void setImmediate(function asyncifyErrorCallback() {
      cb(err)
    })
  }

  setImmediate(function asyncifySuccessCallback() {
    cb(null, src, resourcePaths)
  })
}

ctor.emitter = new events.EventEmitter()

function resolveFilePath(filePath) {
  return path.resolve(process.cwd(), filePath)
}

function getPlugin(plugin, basedir) {
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
  }
  else {
    return require(pluginPath)
  }
}

function applyReworkAssets(css, opts, dirName) {
  if (opts.assets) {
    css.use(assets({
      src: dirName
      , dest: opts.assets.dest || ''
      , prefix: opts.assets.prefix || ''
      , retainName: opts.assets.retainName || ''
      , onFile: function onFile(filename) {
        resourcePaths.assetfiles.push(filename)
      }
    }))
  }
}

function applyReworkPlugins(css, opts, dirName) {
  if (opts.plugins) {
    opts.plugins.forEach(function useOptionPlugins(plugin) {
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
  css.use(vars({map: opts.variables}))
}

function prefilter(src, filename) {
  var config = pkg.resolve(filename)
    , css

  resourcePaths.cssfiles.push(filename)

  ctor.emitter.emit('file', filename)

  if (config && config.atomify && config.atomify.css && config.atomify.css.plugins) {
    css = rework(src)
    config.atomify.css.plugins.forEach(function usePlugins(plugin) {
      css.use(getPlugin(plugin, path.dirname(filename)))
    })
    return css.toString()
  }

  return src
}

function applyRework(opts, resolvedEntry) {
  var css = rework(read(resolvedEntry), {source: resolvedEntry})
      , dirName = path.dirname(resolvedEntry)
      , pkgmgr = opts.bower ? bower : npm

  css.use(pkgmgr({
      root: dirName
      , prefilter: prefilter
  }))

  applyReworkVars(css, opts)
  applyReworkAssets(css, opts, dirName)
  applyReworkPlugins(css, opts, dirName)

  return css.toString({
      sourcemap: opts.debug || opts.sourcemap
      , compress: opts.compress
  })
}

function bundle(opts) {
  var entries = []

  opts.entries.forEach(function resolveEntries(entry) {
    var resolvedEntry = resolveFilePath(entry)

    entries.push(applyRework(opts, resolvedEntry))
  })

  return entries.join(opts.compress ? '' : '\n')
}

function readJSON(filepath) {
  var src = read(filepath)

  try {
    return JSON.parse(src)
  }
  catch(e) {
    throw new Error('Unable to parse "' + filepath + '" file (' + e.message + ').', e)
  }
}

