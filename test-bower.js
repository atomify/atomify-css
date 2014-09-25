var test = require('tape')
  , fs = require('fs')
  , path = require('path')
  , css = require('./')
  , cssFixtures = __dirname + '/test/fixtures/css/'
  , lessFixtures = __dirname + '/test/fixtures/less/'

test('bower - basic css bundling', function (t) {
  t.plan(1)

  var cfg = { entry: path.join(cssFixtures, 'entry.css'), bower: true }
    , correct = fs.readFileSync(path.join(cssFixtures, 'bundle.css'), 'utf8')

  css(cfg, function (err, src) {
    t.equal(src, correct)
  })
})

test('bower - basic less bundling', function (t) {
  t.plan(1)

  var cfg = { entry: path.join(lessFixtures, 'entry.less'), bower: true }
    , correct = fs.readFileSync(path.join(lessFixtures, 'bundle.css'), 'utf8')

  css(cfg, function (err, src) {
    t.equal(src, correct)
  })
})

test('bower - less bundling with module name', function (t) {
  t.plan(1)

  var cfg = { entry: path.join(lessFixtures, 'entry-with-named-module.less'), bower: true }
    , correct = fs.readFileSync(path.join(lessFixtures, 'bundle-with-named-module.css'), 'utf8')

  css(cfg, function (err, src) {
    t.equal(src, correct)
  })
})

test('bower - transformation', function (t) {
  t.plan(1)

  var cfg = {
      entry: path.join(cssFixtures, 'entry.css')
      , transform: function (input) {
        return input.split('background').join('color')
      }
      , bower: true
    }
    , correct = fs.readFileSync(path.join(cssFixtures, 'bundle-transformed.css'), 'utf8')

  css(cfg, function (err, src) {
    t.equal(src, correct)
  })
})

test('bower - opts.output as property', function (t) {
  t.plan(1)

  var cfg = {
      entry: path.join(cssFixtures, 'entry.css')
      , output: path.join(cssFixtures, 'bundle-gen.css')
      , bower: true
    }
    , correct = fs.readFileSync(path.join(cssFixtures, 'bundle.css'), 'utf8')

  css(cfg)

  setTimeout(function () {
    t.equal(fs.readFileSync(cfg.output, 'utf8'), correct)
  }, 250)
})

test('bower - opts.output as string', function (t) {
  t.plan(1)

  var correct = fs.readFileSync(path.join(cssFixtures, 'bundle.css'), 'utf8')
    , output = path.join(cssFixtures, 'bundle-gen.css')
    , cfg = { entry: path.join(cssFixtures, 'entry.css'), bower: true }

  css(cfg, output)

  setTimeout(function () {
    t.equal(fs.readFileSync(output, 'utf8'), correct)
  }, 250)
})

test('bower - providing output property and callback writes file and calls callback', function (t) {
  t.plan(2)

  var cfg = {
      entry: path.join(cssFixtures, 'entry.css')
      , output: path.join(cssFixtures, 'bundle-gen.css')
      , bower: true
    }
    , correct = fs.readFileSync(path.join(cssFixtures, 'bundle.css'), 'utf8')

  if (fs.existsSync(cfg.output)) fs.unlinkSync(cfg.output)

  css(cfg, function (err, src) {
    t.ok(fs.existsSync(cfg.output), 'file written')
    t.equal(src, correct)
  })
})

test('bower - opts.debug generates sourcemap', function (t) {
  t.plan(1)

  var cfg = {
      entry: path.join(cssFixtures, 'entry.css')
      , debug: true
      , bower: true
    }
    , correct = fs.readFileSync(path.join(cssFixtures, 'bundle-with-sourcemap.css'), 'utf8')

  css(cfg, function (err, src) {
    t.equal(src, correct)
  })
})

test('bower - opts.compress compresses output', function (t) {
  t.plan(1)

  var cfg = {
      entry: path.join(cssFixtures, 'entry.css')
      , compress: true
      , bower: true
    }
    , correct = fs.readFileSync(path.join(cssFixtures, 'bundle-compressed.css'), 'utf8')

  css(cfg, function (err, src) {
    t.equal(src, correct)
  })
})

test('bower - opts.debug and opts.compress generates sourcemap and compresses', function (t) {
  t.plan(1)

  var cfg = {
      entry: path.join(cssFixtures, 'entry.css')
      , debug: true
      , compress: true
      , bower: true
    }
    , correct = fs.readFileSync(path.join(cssFixtures, 'bundle-compressed-with-sourcemap.css'), 'utf8')

  css(cfg, function (err, src) {
    t.equal(src, correct)
  })
})

test('bower - opts.assets', function (t) {
  t.plan(1)

  var cfg = {
      entry: path.join(cssFixtures, 'entry-with-asset.css')
      , assets: {
        dest: path.join(cssFixtures, 'assets/images')
        , prefix: 'assets/images/'
      }
      , bower: true
    }
    , correct = fs.readFileSync(path.join(cssFixtures, 'bundle-with-asset.css'), 'utf8')

  css(cfg, function (err, src) {
    t.equal(src, correct)
  })
})

test('bower - opts.assets for LESS', function (t) {
  t.plan(1)

  var cfg = {
      entry: path.join(lessFixtures, 'entry-with-asset.less')
      , assets: {
        dest: path.join(lessFixtures, 'assets/images')
        , prefix: 'assets/images/'
      }
      , bower: true
    }
    , correct = fs.readFileSync(path.join(lessFixtures, 'bundle-with-asset.css'), 'utf8')

  css(cfg, function (err, src) {
    t.equal(src, correct)
  })
})

test('bower - plugins are configurable', function (t) {
  t.plan(1)

  var cfg = {
      entry: path.join(cssFixtures, 'entry-with-inline.css')
      , plugins: [
        ['rework-plugin-inline', __dirname + '/test']
      ]
      , bower: true
    }
    , correct = fs.readFileSync(path.join(cssFixtures, 'bundle-with-inline.css'), 'utf8')

  css(cfg, function (err, src) {
    t.equal(src, correct)
  })
})

test('bower - descendant modules can specify custom plugins', function (t) {
  t.plan(1)

  var cfg = {
      entry: path.join(cssFixtures, 'entry-with-deep-custom-plugins.css')
      , plugins: [
        ['rework-clone']
      ]
      , bower: true
    }
    , correct = fs.readFileSync(path.join(cssFixtures, 'bundle-with-deep-custom-plugins.css'), 'utf8')

  css(cfg, function (err, src) {
    t.equal(src, correct)
  })
})

test('bower - handle importing errors', function (t) {
  t.plan(1)

  var cfg = {
    entry: path.join(cssFixtures, 'import-missing.css')
    , bower: true
  }

  css(cfg, function (err) {
    t.ok(err instanceof Error, 'called callback with error')
  })
})

test('bower - handle entry missing error', function (t) {
  t.plan(1)

  var cfg = {
    entry: path.join(cssFixtures, 'file-does-not-exist.css')
    , bower: true
  }

  css(cfg, function (err) {
    t.ok(err instanceof Error, 'called callback with error')
  })
})

test('bower - output to non-existent directory', function (t) {
  t.plan(1)

  var correct = fs.readFileSync(path.join(cssFixtures, 'bundle.css'), 'utf8')
    , output = path.join(cssFixtures, 'new-dir', 'bundle-new-dir.css')
    , cfg = { entry: path.join(cssFixtures, 'entry.css'), bower: true }

  if (fs.existsSync(output)) fs.unlinkSync(output)

  css(cfg, output)

  setTimeout(function () {
    t.equal(fs.readFileSync(output, 'utf8'), correct)
  }, 250)
})
