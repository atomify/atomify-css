var less = require('npm-less/less')
  , path = require('path')
  , events = require('events')
  , resrc = require('resrcify/custom').resrc
  , regexp = /url\([\"\'](.*?)[\"\']\)/g
  , res
  , assetsConfig

var ctor = module.exports = function (opts, cb) {
  assetsConfig = opts.assets
  if (assetsConfig) {
    // Add default error handler
    assetsConfig.onError = assetsConfig.onError || onError
  }

  less(path.resolve(process.cwd(), opts.entry), {preprocess: preprocess}, function (err, output) {
    if (err) return process.nextTick(function () { cb(err) })

    process.nextTick(function() { cb(null, output.toCSS(opts)) })
  })
}

ctor.emitter = new events.EventEmitter()

function preprocess (file, src) {
  ctor.emitter.emit('file', file)

  if (!assetsConfig) return src

  while ((res = regexp.exec(src)) !== null) {
    src = src.replace(res[1], resrc(res[1], file, assetsConfig))
  }

  return src
}

function onError(err) {
  console.error('asset not copied:', err.path)
}

