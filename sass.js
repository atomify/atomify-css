var sass = require('node-sass')
  , css = require('./css')
  , path = require('path')

module.exports = function (opts, cb) {
  css(opts, function (err, src) {
    opts.data = src
    cb(err, sass.renderSync(opts))
  })
}
