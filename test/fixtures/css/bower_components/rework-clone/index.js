exports = module.exports = function (options) {
  return function clone(style) {
    return Clone(style, options || {});
  };
};

function Clone (style, options) {
  var regexp = options.regexp || /^(clone|copy)?$/i,
  rules = style.rules,
  doProcess = function(rule) {
    return process(rules, regexp, rule);
  };
  rules = rules.map(function (rule) {
    if (rule.type === 'media') {
      rule.rules = rule.rules.map(doProcess);
      return rule;
    }
    if (rule.type === 'rule') {
      return doProcess(rule);
    }
  });
}

function process (rules, regexp, rule) {
  var clones = getClones(regexp, rule.declarations);
  rule.declarations = getProperties(rules, clones)
    .concat(rule.declarations)
    .filter(function (dec) {
      return !regexp.test(dec.property);
    });
  return rule;
}

function getClones (regexp, declarations) {
  return declarations.filter(function (dec) {
    return regexp.test(dec.property);
  }).map(function (dec) {
    return dec.value;
  });
}

function cloneObject (obj) {
  var isArray = Array.isArray(obj),
      newObj = isArray ? [] : {};
  if (isArray) {
    obj.forEach(function(item, index) {
      newObj[index] = item;
    });
  } else {
    for (key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (Object.prototype.toString.call(obj[key]) === "[object Object]") {
          newObj[key] = cloneObject(obj[key]);
        } else {
          newObj[key] = obj[key];
        }
      }
    }
  }
  return newObj;
}

function getProperties (rules, selectors) {
  var declarations = [],
  reg = /\s*\!important\s*$/;
  rules.filter(function (rule) {
    return rule.selectors && rule.selectors.length > 0;
  }).forEach(function (rule) {
    selectors.forEach(function (selector) {
      var important = false;
      if (reg.test(selector)) {
        important = true;
        selector = selector.replace(reg, '');
      }
      if (rule.selectors.indexOf(selector) !== -1) {
        declarations = declarations.concat(rule.declarations.map(function (declaration) {
          declaration = cloneObject(declaration);
          if (important) {
            declaration.value = declaration.value + ' !important';
          }
          return declaration;
        }));
      }
    });
  });
  return declarations;
}
