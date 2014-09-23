var sass
  , css = require('./css')
  , path = require('path')

module.exports = function (opts, cb) {
  try {
    sass = require(opts.nodeSassPath || 'node-sass')
  } catch (err) {
    throw new Error('Please specify the node-sass module path.')
  }

  css(opts, function (err, src) {
    opts.data = src
    cb(err, sass.renderSync(opts))
  })
}
