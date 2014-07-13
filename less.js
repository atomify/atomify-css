var less = require('npm-less/less')
  , path = require('path')
  , resrc = require('resrcify/custom').resrc
  , regexp = /url\([\"\'](.*?)[\"\']\)/g
  , res
  , assetsConfig

module.exports = function (opts, cb) {
  assetsConfig = opts.assets

  less(path.resolve(process.cwd(), opts.entry), {preprocess: preprocess}, function (err, output) {
    if (err) throw err

    cb(null, output.toCSS(opts))
  })
}

function preprocess (file, src) {
  if (!assetsConfig) return src

  while ((res = regexp.exec(src)) !== null) {
    src = src.replace(res[1], resrc(res[1], file, assetsConfig))
  }

  return src
}
