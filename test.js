var test = require('tape')
  , fs = require('fs')
  , path = require('path')
  , css = require('./')
  , cssFixtures = __dirname + '/test/fixtures/css/'
  , lessFixtures = __dirname + '/test/fixtures/less/'

test('basic css bundling', function (t) {
  t.plan(1)

  var cfg = { entry: path.join(cssFixtures, 'entry.css') }
    , correct = fs.readFileSync(path.join(cssFixtures, 'bundle.css'), 'utf8')

  css(cfg, function (err, src) {
    t.equal(src, correct)
  })
})

test('basic less bundling', function (t) {
  t.plan(1)

  var cfg = { entry: path.join(lessFixtures, 'entry.less') }
    , correct = fs.readFileSync(path.join(lessFixtures, 'bundle.css'), 'utf8')

  css(cfg, function (err, src) {
    t.equal(src, correct)
  })
})

test('transformation', function (t) {
  t.plan(1)

  var cfg = {
      entry: path.join(cssFixtures, 'entry.css')
      , transform: function (input) {
        return input.split('background').join('color')
      }
    }
    , correct = fs.readFileSync(path.join(cssFixtures, 'bundle-transformed.css'), 'utf8')

  css(cfg, function (err, src) {
    t.equal(src, correct)
  })
})

test('opts as string', function (t) {
  t.plan(1)

  var cfg = path.join(cssFixtures, 'entry.css')
    , correct = fs.readFileSync(path.join(cssFixtures, 'bundle.css'), 'utf8')

  css(cfg, function (err, src) {
    t.equal(src, correct)
  })
})
