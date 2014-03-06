var visit = require('rework-visit')

module.exports = exports = function(unit) {

  function defaultUnit(style) {
    visit(style, function(declarations) {
      declarations.forEach(function(d) {
        if (!isNaN(d.value))
          d.value += !d.value || exports.numeric[d.property] ? '' : unit
      })
    })
  }

  // Called as factory function
  if (typeof unit == 'string') return defaultUnit

  // Invoked directly, use 'px' as default
  var style = unit
  unit = 'px'
  defaultUnit(style)
}

exports.numeric = {
  "column-count": true,
  "fill-opacity": true,
  "font-weight": true,
  "line-height": true,
  "opacity": true,
  "orphans": true,
  "widows": true,
  "z-index": true,
  "zoom": true
}
