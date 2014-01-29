var css = require('../')
  , fs = require('fs')
  , cfg = {
//    entry: __dirname + '/fixtures/css/a.css',
    entry: __dirname + '/fixtures/less/a.less',
    transform: function (src) {
      return src.split('ddd').join('f00');
    }
  };

css(cfg, function (err, src) {
  if (err) throw err;

  fs.writeFileSync(__dirname + '/bundle.css', src, 'utf8');
})
