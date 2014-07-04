var css = require('./css')
  , less = require('./less')
  , fs = require('fs')
  , path = require('path')
  , mkdirp = require('mkdirp')
  , writer = require('write-to-path')
  , rework = require('rework')
  , assets = require('rework-assets')
  , isLess

module.exports = function (opts, cb) {
  if (typeof opts === 'string') opts = {entry: opts};
  if (typeof cb === 'string') opts.output = cb;

  if (opts.entry.substr(-4) === 'less') {
    isLess = true
    less(opts, complete)
  } else {
    css(opts, complete)
  }

  function complete (err, src) {
    if (opts.transform && !err) src = opts.transform(src)

    if (isLess && opts.assets) {
      var resolvedPath = path.resolve(process.cwd(), opts.output)

      src = rework(src)
        .use(assets({
          src: path.dirname(resolvedPath)
          , dest: opts.assets.dest || ''
          , prefix: opts.assets.prefix || ''
        }))
        .toString({
          sourcemap: opts.debug || opts.sourcemap
          , compress: opts.compress
        })
    }

    if (opts.output) {
      // we definitely have to write the file
      var outputPath = path.resolve(process.cwd(), opts.output)
        , outputDir = path.dirname(outputPath)
        , writeFile = writer(outputPath, {debug: opts.debug})

      if (!fs.existsSync(outputDir)) mkdirp.sync(outputDir)

      // we might need to call a callback also
      if (typeof cb === 'function') {
        var _cb = cb
        cb = function (err, src) {
          writeFile(err, src)
          _cb(err, src)
        }
      } else {
        cb = writeFile
      }
    }

    cb(err, src)
  }
}
