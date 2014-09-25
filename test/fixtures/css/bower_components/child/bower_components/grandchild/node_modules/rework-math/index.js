/**
 * Module dependencies.
 */

var visit = require('rework-visit');

module.exports = function() {
  function substitute(decl) {
    // grab math(...) value
    var math = decl.value.split('math(')[1];
    // find the closing bracket
    math = math.slice(0, math.lastIndexOf(')'));
    // get the trailing unit or just add nothing
    var unit = (math.match(/%|in|cm|mm|em|ex|pt|pc|px/g, '')) ? math.match(/%|in|cm|mm|em|ex|pt|pc|px/g, '')[0] : '';

    math = math.replace(/%|in|cm|mm|em|ex|pt|pc|px/g, '');
    // do some ev[i|a]l
    var sum = eval(math);
    if (sum) {
      return sum + unit;
    } else {
      // log the error
      var error = {
        "declaration": decl,
        "preEval": math,
        "postEval": sum,
        "unit": unit
      };
      throw new Error('error');
    }
  }

  return function math(style) {
    visit(style, function(declarations, node) {
      declarations.forEach(function(decl) {
        if (!decl.value || !decl.value.match(/\bmath\(/)) {
          return;
        }
        decl.value = substitute(decl);
      });
    });
  };
};
