'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.$toggle = $toggle;
exports.$unset = $unset;
exports.$splice = $splice;
exports.$push = $push;
exports.$unshift = $unshift;
exports.$pop = $pop;
exports.$shift = $shift;
exports.$sort = $sort;
exports.$remove = $remove;
exports.$merge = $merge;
exports.$set = $set;
exports.update = update;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Immutable = function () {
  function Immutable(value, parent, path) {
    _classCallCheck(this, Immutable);

    this.parent = parent;
    this.value = value;
    this.path = path;
    this.children = [];
    this.childMap = {};
  }

  _createClass(Immutable, [{
    key: 'apply',
    value: function apply(modifier) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var newValue = modifier.apply(undefined, [this.value].concat(args));
      if (newValue !== this.value) {
        this.value = newValue;
        this.change();
      }
      return this;
    }
  }, {
    key: 'change',
    value: function change() {
      var _this = this;

      if (!this.changed) {
        this.changed = true;
        if (this.value instanceof Array) {
          this.value = this.value.slice();
        } else if (isPlainObject(this.value)) {
          this.value = Object.assign({}, this.value);
        }
      }

      this.children.forEach(function (x) {
        _this.value[x.path] = x.value;
      });

      if (this.parent) {
        this.parent.change();
      }
    }
  }, {
    key: 'child',
    value: function child(path) {
      if (path in this.childMap) {
        return this.childMap[path];
      }
      var child = new Immutable(this.value[path], this, path);
      this.children.push(child);
      this.childMap[path] = child;
      return child;
    }
  }, {
    key: 'childFromPath',
    value: function childFromPath(path) {
      return path.split(/\./).reduce(function (parent, path) {
        return parent.child(path);
      }, this);
    }
  }]);

  return Immutable;
}();

function $toggle(current) {
  for (var _len2 = arguments.length, props = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    props[_key2 - 1] = arguments[_key2];
  }

  if (!props.length) {
    return !current;
  }

  if (current instanceof Array) {
    var array = current.slice();
    props.forEach(function (prop) {
      return array[prop] = !array[prop];
    });
    return array;
  }
  var obj = Object.assign({}, current);
  props.forEach(function (prop) {
    return obj[prop] = !obj[prop];
  });
  return obj;
}

function $unset(current) {
  if (!current) return;
  var newValue = current;
  var isArray = current instanceof Array;

  for (var _len3 = arguments.length, props = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    props[_key3 - 1] = arguments[_key3];
  }

  props.forEach(function (prop) {
    if (prop in newValue) {
      if (newValue === current) {
        if (isArray) {
          newValue = current.slice();
        } else {
          newValue = Object.assign({}, current);
        }
      }
      delete newValue[prop];
    }
  });

  return newValue;
}

function arrayOp(array, method, args) {
  var _array;

  if (!array) {
    array = [];
  } else {
    array = array.slice();
  }
  (_array = array)[method].apply(_array, _toConsumableArray(args));
  return array;
}

function $splice(array, index, count) {
  for (var _len4 = arguments.length, newItems = Array(_len4 > 3 ? _len4 - 3 : 0), _key4 = 3; _key4 < _len4; _key4++) {
    newItems[_key4 - 3] = arguments[_key4];
  }

  if (newItems.length || count) {
    return arrayOp(array, 'splice', [index, count].concat(newItems));
  }
  return array;
}

function $push(array) {
  for (var _len5 = arguments.length, newItems = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    newItems[_key5 - 1] = arguments[_key5];
  }

  if (newItems.length) {
    return arrayOp(array, 'push', newItems);
  }
  return array;
}

function $unshift(array) {
  for (var _len6 = arguments.length, newItems = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
    newItems[_key6 - 1] = arguments[_key6];
  }

  if (newItems.length) {
    return arrayOp(array, 'unshift', newItems);
  }
  return array;
}

function $pop(array) {
  if (!array || array.length) {
    return arrayOp(array, 'pop');
  }
  return array;
}

function $shift(array) {
  if (!array || array.length) {
    return arrayOp(array, 'pop');
  }
  return array;
}

function $sort(array, sorter) {
  return arrayOp(array, 'sort', sorter);
}

var isPlainObject = function isPlainObject(val) {
  return !!val && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && val.constructor === Object;
};

function $remove(array) {
  for (var _len7 = arguments.length, items = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
    items[_key7 - 1] = arguments[_key7];
  }

  var newArray = array.filter(function (x) {
    return items.indexOf(x) === -1;
  });
  return newArray.length === array.length ? array : newArray;
}

function $merge(obj) {
  for (var _len8 = arguments.length, values = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
    values[_key8 - 1] = arguments[_key8];
  }

  if (values.length) {
    var mergedObj = obj;
    values.forEach(function (value) {
      if (value === null || value === undefined) return;
      for (var key in value) {
        if (value[key] !== mergedObj[key]) {
          if (mergedObj === obj) {
            mergedObj = Object.assign({}, obj);
          }
          mergedObj[key] = value[key];
        }
      }
    });
    return mergedObj;
  }

  return obj;
}

function $set(current) {
  for (var _len9 = arguments.length, args = Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
    args[_key9 - 1] = arguments[_key9];
  }

  if (args.length < 2) {
    return args[0];
  }
  var prop = args[0],
      value = args[1];

  if (current instanceof Array) {
    var array = current.slice();
    array[prop] = value;
    return array;
  }
  var obj = _extends({}, current);
  obj[prop] = value;
  return obj;
}

function update(state, changes) {
  var root = new Immutable(state);

  function traversal(parent, node) {
    Object.entries(node).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];

      var child = parent.childFromPath(key);
      if (value instanceof Array) {
        if (value[0] instanceof Function) {
          child.apply.apply(child, _toConsumableArray(value));
        } else {
          if (child.value instanceof Array) {
            var spec = value[0];
            if (spec instanceof Array) {
              // apply for each child
              child.value.forEach(function (item, index) {
                var _child$child;

                (_child$child = child.child(index)).apply.apply(_child$child, _toConsumableArray(spec));
              });
            } else {
              child.value.forEach(function (item, index) {
                traversal(child.child(index), spec);
              });
            }
          } else {
            throw new Error('Invalid spec. Cannot apply spec for ' + child.value);
          }
        }
      } else if (isPlainObject(value)) {
        traversal(child, value);
      } else {
        child.apply($set, value);
      }
    });
  }

  if (changes instanceof Array) {
    root.apply.apply(root, _toConsumableArray(changes));
  } else {
    traversal(root, changes);
  }

  return root.value;
}
//# sourceMappingURL=index.js.map