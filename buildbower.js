'use strict';

var s = require('sane-scaffold')
  , fs = require('fs')
  , path = require('path')
  , files = {}
  , pending = 2

module.exports = function(cb){

  s
    .start('./test/fixtures/css')
    .directory('bower_components', function(dir){
      dir.directory('child', buildChild)
      dir.directory('foo', function(dir){
        dir.file('package.json', files['fixtures/css/bower_components/foo/package.json'])
        dir.file('index.scss', files['fixtures/css/bower_components/foo/index.scss'])
      })

    })
    .done(function (){
      done(cb)
    })

  s
    .start('./test/fixtures/less')
    .directory('bower_components', function(dir){
      dir.directory('foo', function(dir){
        dir.file('index.less', files['fixtures/less/bower_components/foo/index.less'])
      })
    })
    .done(function (){
      done(cb)
    })

}

function done(cb){
  if(!--pending) cb()
}

function buildChild(dir){
  dir.file('bower.json', files['fixtures/css/bower_components/child/bower.json'])
  dir.file('index.css', files['fixtures/css/bower_components/child/index.css'])
  dir.file('other.css', files['fixtures/css/bower_components/child/other.css'])
  dir.file('package.json', files['fixtures/css/bower_components/child/package.json'])

  dir.directory('bower_components', function(dir){
    dir.directory('grandchild', buildGrandchild)
  })

  dir.directory('node_modules', function(dir){
    dir.directory('rework-default-unit', function(dir){
      dir.file('index.js', files['fixtures/css/bower_components/child/node_modules/rework-default-unit/index.js'])
      dir.directory('node_modules', function(dir){
        dir.directory('rework-visit', function(dir){
          dir.file('index.js', files['fixtures/css/bower_components/child/node_modules/rework-default-unit/node_modules/rework-visit/index.js'])
        })
      })
    })
  })
}

function buildGrandchild(dir){
  dir.file('index.css', files['fixtures/css/bower_components/child/bower_components/grandchild/index.css'])
  dir.file('package.json', files['fixtures/css/bower_components/child/bower_components/grandchild/package.json'])

  dir.directory('nested', function(dir){
    dir.file('thing.css', files['fixtures/css/bower_components/child/bower_components/grandchild/nested/thing.css'])
  })

  dir.directory('node_modules', function(dir){
    dir.directory('rework-math', function(dir){
      dir.file('index.js', files['fixtures/css/bower_components/child/bower_components/grandchild/node_modules/rework-math/index.js'])
      dir.directory('node_modules', function(dir){
        dir.directory('rework-visit', function(dir){
          dir.file('index.js', files['fixtures/css/bower_components/child/bower_components/grandchild/node_modules/rework-math/node_modules/rework-visit/index.js'])
        })
      })
    })
  })
}



files['fixtures/css/bower_components/child/bower.json'] =
"{\n  \"name\": \"child\",\n  \"version\": \"0.0.0\",\n  \"description\": \"\",\n  \"main\": \"index.js\",\n  \"dependencies\": {\n    \"rework-default-unit\": \"~0.0.1\"\n  },\n  \"atomify\": {\n    \"css\": {\n      \"entry\": \"index.css\",\n      \"plugins\": [\n        \"rework-default-unit\"\n      ]\n    }\n  }\n}\n"

files['fixtures/css/bower_components/child/index.css'] =
".child {\n  width: 100;\n}\n\n@import \"./other.css\";\n\n@import \"grandchild\";\n"

files['fixtures/css/bower_components/child/other.css'] =
".other-child {\n  height: 66;\n}\n"

files['fixtures/css/bower_components/child/package.json'] =
"{\n  \"name\": \"child\",\n  \"version\": \"0.0.0\",\n  \"description\": \"\",\n  \"main\": \"index.js\",\n  \"dependencies\": {\n    \"rework-default-unit\": \"~0.0.1\"\n  },\n  \"atomify\": {\n    \"css\": {\n      \"entry\": \"index.css\",\n      \"plugins\": [\n        \"rework-default-unit\"\n      ]\n    }\n  }\n}\n"

files['fixtures/css/bower_components/child/bower_components/grandchild/index.css'] =
".grandchild {\n  width: math(5 * 5px);\n}\n\n@import \"./nested/thing.css\";\n"

files['fixtures/css/bower_components/child/bower_components/grandchild/package.json'] =
"{\n  \"name\": \"grandchild\",\n  \"version\": \"0.0.0\",\n  \"description\": \"\",\n  \"main\": \"index.js\",\n  \"dependencies\": {\n    \"rework-math\": \"~1.0.1\"\n  },\n  \"atomify\": {\n    \"css\": {\n      \"entry\": \"index.css\",\n      \"plugins\": [\n        [\"rework-math\"]\n      ]\n    }\n  }\n}\n"

files['fixtures/css/bower_components/child/bower_components/grandchild/nested/thing.css'] =
".nested-grandchild-style {\n  color: lightpink;\n  width: math(5 * 20em);\n}\n"

files['fixtures/css/bower_components/child/node_modules/rework-default-unit/index.js'] =
"var visit = require('rework-visit')\n\nmodule.exports = exports = function(unit) {\n\n  function defaultUnit(style) {\n    visit(style, function(declarations) {\n      declarations.forEach(function(d) {\n        if (!isNaN(d.value))\n          d.value += !d.value || exports.numeric[d.property] ? '' : unit\n      })\n    })\n  }\n\n  // Called as factory function\n  if (typeof unit == 'string') return defaultUnit\n\n  // Invoked directly, use 'px' as default\n  var style = unit\n  unit = 'px'\n  defaultUnit(style)\n}\n\nexports.numeric = {\n  \"column-count\": true,\n  \"fill-opacity\": true,\n  \"font-weight\": true,\n  \"line-height\": true,\n  \"opacity\": true,\n  \"orphans\": true,\n  \"widows\": true,\n  \"z-index\": true,\n  \"zoom\": true\n}\n"

files['fixtures/css/bower_components/child/node_modules/rework-default-unit/node_modules/rework-visit/index.js'] =
"\n/**\n * Expose `visit()`.\n */\n\nmodule.exports = visit;\n\n/**\n * Visit `node`'s declarations recursively and\n * invoke `fn(declarations, node)`.\n *\n * @param {Object} node\n * @param {Function} fn\n * @api private\n */\n\nfunction visit(node, fn){\n  node.rules.forEach(function(rule){\n    // @media etc\n    if (rule.rules) {\n      visit(rule, fn);\n      return;\n    }\n\n    // keyframes\n    if (rule.keyframes) {\n      rule.keyframes.forEach(function(keyframe){\n        fn(keyframe.declarations, rule);\n      });\n      return;\n    }\n\n    // @charset, @import etc\n    if (!rule.declarations) return;\n\n    fn(rule.declarations, node);\n  });\n};\n"

files['fixtures/css/bower_components/child/bower_components/grandchild/node_modules/rework-math/index.js'] =
"/**\n * Module dependencies.\n */\n\nvar visit = require('rework-visit');\n\nmodule.exports = function() {\n  function substitute(decl) {\n    // grab math(...) value\n    var math = decl.value.split('math(')[1];\n    // find the closing bracket\n    math = math.slice(0, math.lastIndexOf(')'));\n    // get the trailing unit or just add nothing\n    var unit = (math.match(/%|in|cm|mm|em|ex|pt|pc|px/g, '')) ? math.match(/%|in|cm|mm|em|ex|pt|pc|px/g, '')[0] : '';\n\n    math = math.replace(/%|in|cm|mm|em|ex|pt|pc|px/g, '');\n    // do some ev[i|a]l\n    var sum = eval(math);\n    if (sum) {\n      return sum + unit;\n    } else {\n      // log the error\n      var error = {\n        \"declaration\": decl,\n        \"preEval\": math,\n        \"postEval\": sum,\n        \"unit\": unit\n      };\n      throw new Error('error');\n    }\n  }\n\n  return function math(style) {\n    visit(style, function(declarations, node) {\n      declarations.forEach(function(decl) {\n        if (!decl.value || !decl.value.match(/\\bmath\\(/)) {\n          return;\n        }\n        decl.value = substitute(decl);\n      });\n    });\n  };\n};\n"

files['fixtures/css/bower_components/child/bower_components/grandchild/node_modules/rework-math/node_modules/rework-visit/index.js'] =
"\n/**\n * Expose `visit()`.\n */\n\nmodule.exports = visit;\n\n/**\n * Visit `node`'s declarations recursively and\n * invoke `fn(declarations, node)`.\n *\n * @param {Object} node\n * @param {Function} fn\n * @api private\n */\n\nfunction visit(node, fn){\n  node.rules.forEach(function(rule){\n    // @media etc\n    if (rule.rules) {\n      visit(rule, fn);\n      return;\n    }\n\n    // keyframes\n    if (rule.keyframes) {\n      rule.keyframes.forEach(function(keyframe){\n        fn(keyframe.declarations, rule);\n      });\n      return;\n    }\n\n    // @charset, @import etc\n    if (!rule.declarations) return;\n\n    fn(rule.declarations, node);\n  });\n};\n"

files['fixtures/css/bower_components/foo/index.scss'] =
"$rojo: #f00;\n\n.red {\n  color: $rojo;\n}\n"

files['fixtures/css/bower_components/foo/package.json'] =
"{\n  \"style\": \"index.scss\"\n}\n"

files['fixtures/less/bower_components/foo/index.less'] =
".red {\n  color: #FF0000;\n}\n"
