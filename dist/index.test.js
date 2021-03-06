"use strict";

var _index = require("./index");

describe("samples", function () {
  it("all api", function () {
    var original = {
      a: {
        b: {
          c: {
            d: {
              e: {
                f: {}
              }
            }
          }
        }
      },
      arrayPush: [],
      objMerge: {
        name: "Peter"
      },
      toggleMe: false,
      toggleMyProp: {
        done: false,
        completed: true
      },
      removeSecond: [1, 2, 3, 4],
      removeAppleAndBanana: ["Orange", "Apple", "Banana"],
      unsetMyProp: {
        data1: new Date(),
        data2: true
      },
      sqrt: 100,
      doubleItems: [1, 2, 3, 4, 5, 6, 7, 8],
      swapItems: ["left", "right"],
      increaseProps: {
        one: 1,
        two: 2,
        three: 3
      },
      removeByIndexes: [1, 2, 3, 4],
      batchProcessing: {},
      pipeProcessing: 'hello'
    };
    var specs = {
      // you can change separator by using configure({ separator: /pattern/ })
      "a.b.c.d.e.f": [_index.$set, 100],
      "a.b.c.d.e": [_index.$set, "newProp", 100],
      arrayPush: [_index.$push, 1, 2, 3, 4, 5],
      objMerge: [_index.$assign, { age: 20 }, { school: "A" }],
      // using obj method as modifier
      sqrt: function sqrt(x) {
        return Math.sqrt(x);
      },

      // toggle property itself
      toggleMe: [_index.$toggle],
      // toggle child properties
      toggleMyProp: [_index.$toggle, "done", "completed"],
      unsetMyProp: [_index.$unset, "data1", "data2"],
      removeSecond: [_index.$splice, 1, 1],
      // remove array items by its value
      removeAppleAndBanana: [_index.$remove, "Apple", "Banana"],
      // using sub spec to update all array items
      // sub spec syntax [spec]
      // spec can be [action, ...args] or spec tree { a: {  b: ....} }
      doubleItems: [[function (x) {
        return x * 2;
      }]],
      // use action name instead of function
      swapItems: ["swap", 0, 1],
      // using sub spec to update all obj values
      increaseProps: [[function (x) {
        return x + 1;
      }]],
      removeByIndexes: ["removeAt", 3, 1],
      batchProcessing: ["batch", ["set", "name", "Peter"], ["set", "age", 20]],
      pipeProcessing: ['batch', function (x) {
        return x.toUpperCase();
      }, function (x) {
        return x + ' WORLD!!!';
      }]
    };
    var result = (0, _index.update)(original, specs);

    expect(result).not.toBe(original);
    expect(result).toEqual({
      a: {
        b: {
          c: {
            d: {
              e: {
                f: 100,
                newProp: 100
              }
            }
          }
        }
      },
      arrayPush: [1, 2, 3, 4, 5],
      objMerge: {
        name: "Peter",
        age: 20,
        school: "A"
      },
      toggleMe: true,
      toggleMyProp: {
        done: true,
        completed: false
      },
      unsetMyProp: {},
      sqrt: 10,
      removeSecond: [1, 3, 4],
      removeAppleAndBanana: ["Orange"],
      doubleItems: [2, 4, 6, 8, 10, 12, 14, 16],
      swapItems: ["right", "left"],
      increaseProps: {
        one: 2,
        two: 3,
        three: 4
      },
      removeByIndexes: [1, 3],
      batchProcessing: {
        name: "Peter",
        age: 20
      },
      pipeProcessing: 'HELLO WORLD!!!'
    });
  });

  it("typescript api, selector proxy and modifier", function () {
    var original = { a: { b: { c: [] } } };
    var result = (0, _index.updatePath)(original, [function (x) {
      return x.a.b.c;
    }, "push", 1, 2, 3], [function (x) {
      return x.a.b;
    }, "set", "name", "Peter"]);
    expect(result).toEqual({
      a: {
        b: {
          name: "Peter",
          c: [1, 2, 3]
        }
      }
    });
  });

  it("typescript api, proxy only", function () {
    var original = { a: { b: { c: [] } } };
    var result = (0, _index.updatePath)(original, function (x) {
      return x.a.b.c.push(1, 2, 3);
    }, function (x) {
      return x.a.b.name = "Peter";
    });

    expect(result).toEqual({
      a: {
        b: {
          name: "Peter",
          c: [1, 2, 3]
        }
      }
    });
  });
});

describe("update", function () {
  describe("$push", function () {
    var push7 = [_index.$push, 7];
    var original = [1];

    it("pushes", function () {
      expect((0, _index.update)(original, push7)).toEqual([1, 7]);
    });
    it("does not mutate the original object", function () {
      (0, _index.update)(original, push7);
      expect(original).toEqual([1]);
    });

    it("keeps reference equality when possible", function () {
      expect((0, _index.update)(original, [_index.$push])).toBe(original);
    });
  });

  describe("$unshift", function () {
    var unshift7 = [_index.$unshift, 7];
    var original = [1];
    it("unshifts", function () {
      expect((0, _index.update)(original, unshift7)).toEqual([7, 1]);
    });
    it("does not mutate the original object", function () {
      (0, _index.update)(original, unshift7);
      expect(original).toEqual([1]);
    });
    it("keeps reference equality when possible", function () {
      expect((0, _index.update)(original, [_index.$unshift])).toBe(original);
    });
  });

  describe("$splice", function () {
    var original = [1, 4, 3];
    var spliceData = [_index.$splice, 1, 1, 2];
    it("splices", function () {
      expect((0, _index.update)(original, spliceData)).toEqual([1, 2, 3]);
    });
    it("does not mutate the original object", function () {
      (0, _index.update)(original, spliceData);
      expect(original).toEqual([1, 4, 3]);
    });

    it("keeps reference equality when possible", function () {
      expect((0, _index.update)(original, [_index.$splice])).toBe(original);
    });
  });

  describe("$assign", function () {
    var original = { a: "b" };
    var mergeData = [_index.$assign, { c: "d" }];
    it("merges", function () {
      expect((0, _index.update)(original, mergeData)).toEqual({
        a: "b",
        c: "d"
      });
    });
    it("does not mutate the original object", function () {
      (0, _index.update)(original, mergeData);
      expect(original).toEqual({ a: "b" });
    });
    it("keeps reference equality when possible", function () {
      var original = { a: { b: { c: true } } };
      expect((0, _index.update)(original, { a: [_index.$assign] })).toBe(original);
      expect((0, _index.update)(original, { a: [_index.$assign, { b: original.a.b }] })).toBe(original);

      // Merging primatives of the same value should return the original.
      expect((0, _index.update)(original, { a: { b: [_index.$assign, { c: true }] } })).toBe(original);

      // Two objects are different values even though they are deeply equal.
      expect((0, _index.update)(original, { a: [_index.$assign, { b: { c: true } }] })).not.toBe(original);
      expect((0, _index.update)(original, {
        a: [_index.$assign, { b: original.a.b, c: false }]
      })).not.toBe(original);
    });
  });

  describe("$set", function () {
    it("sets", function () {
      expect((0, _index.update)({ a: "b" }, [_index.$set, { c: "d" }])).toEqual({ c: "d" });
    });
    it("does not mutate the original object", function () {
      var obj = { a: "b" };
      (0, _index.update)(obj, [_index.$set, { c: "d" }]);
      expect(obj).toEqual({ a: "b" });
    });
    it("keeps reference equality when possible", function () {
      var original = { a: 1 };
      expect((0, _index.update)(original, { a: [_index.$set, 1] })).toBe(original);
      expect((0, _index.update)(original, { a: [_index.$set, 2] })).not.toBe(original);
    });
  });

  describe("$toggle", function () {
    var original = { a: false, b: true };
    var toggleData = [_index.$toggle, "a", "b"];
    it("toggles false to true and true to false", function () {
      expect((0, _index.update)(original, toggleData)).toEqual({
        a: true,
        b: false
      });
    });
    it("does not mutate the original object", function () {
      var obj = { a: false };
      (0, _index.update)(obj, [_index.$toggle, "a"]);
      expect(obj).toEqual({ a: false });
    });
  });

  describe("$unset", function () {
    it("unsets", function () {
      expect((0, _index.update)({ a: "b" }, [_index.$unset, "a"]).a).toBe(undefined);
    });
    it("removes the key from the object", function () {
      var removed = (0, _index.update)({ a: "b" }, [_index.$unset, "a"]);
      expect("a" in removed).toBe(false);
    });
    it("removes multiple keys from the object", function () {
      var original = { a: "b", c: "d", e: "f" };
      var removed = (0, _index.update)(original, [_index.$unset, "a", "e"]);
      expect("a" in removed).toBe(false);
      expect("a" in original).toBe(true);
      expect("e" in removed).toBe(false);
      expect("e" in original).toBe(true);
    });

    it("keeps reference equality when possible", function () {
      var original = { a: 1 };
      expect((0, _index.update)(original, [_index.$unset, "b"])).toBe(original);
      expect((0, _index.update)(original, [_index.$unset, "a"])).not.toBe(original);
    });
  });

  describe("deep update", function () {
    it("works", function () {
      expect((0, _index.update)({
        a: "b",
        c: {
          d: "e",
          f: [1],
          g: [2],
          h: [3],
          i: { j: "k" },
          l: 4,
          m: "n"
        }
      }, {
        c: {
          d: [_index.$set, "m"],
          f: [_index.$push, 5],
          g: [_index.$unshift, 6],
          h: [_index.$splice, 0, 1, 7],
          i: [_index.$assign, { n: "o" }],
          l: [function (x) {
            return x * 2;
          }],
          m: [function (x) {
            return x + x;
          }]
        }
      })).toEqual({
        a: "b",
        c: {
          d: "m",
          f: [1, 5],
          g: [6, 2],
          h: [7],
          i: { j: "k", n: "o" },
          l: 8,
          m: "nn"
        }
      });
    });
    it("keeps reference equality when possible", function () {
      var original = { a: { b: 1 }, c: { d: { e: 1 } } };

      expect((0, _index.update)(original, { a: { b: [_index.$set, 1] } })).toBe(original);
      expect((0, _index.update)(original, { a: { b: [_index.$set, 1] } }).a).toBe(original.a);

      expect((0, _index.update)(original, { c: { d: { e: [_index.$set, 1] } } })).toBe(original);
      expect((0, _index.update)(original, { c: { d: { e: [_index.$set, 1] } } }).c).toBe(original.c);
      expect((0, _index.update)(original, { c: { d: { e: [_index.$set, 1] } } }).c.d).toBe(original.c.d);

      expect((0, _index.update)(original, {
        a: { b: [_index.$set, 1] },
        c: { d: { e: [_index.$set, 1] } }
      })).toBe(original);
      expect((0, _index.update)(original, {
        a: { b: [_index.$set, 1] },
        c: { d: { e: [_index.$set, 1] } }
      }).a).toBe(original.a);
      expect((0, _index.update)(original, {
        a: { b: [_index.$set, 1] },
        c: { d: { e: [_index.$set, 1] } }
      }).c).toBe(original.c);
      expect((0, _index.update)(original, {
        a: { b: [_index.$set, 1] },
        c: { d: { e: [_index.$set, 1] } }
      }).c.d).toBe(original.c.d);

      expect((0, _index.update)(original, { a: { b: [_index.$set, 2] } })).not.toBe(original);
      expect((0, _index.update)(original, { a: { b: [_index.$set, 2] } }).a).not.toBe(original.a);
      expect((0, _index.update)(original, { a: { b: [_index.$set, 2] } }).a.b).not.toBe(original.a.b);

      expect((0, _index.update)(original, { a: { b: [_index.$set, 2] } }).c).toBe(original.c);
      expect((0, _index.update)(original, { a: { b: [_index.$set, 2] } }).c.d).toBe(original.c.d);
    });
  });

  it("should accept array spec to modify arrays", function () {
    var original = { value: [{ a: 0 }] };
    var modified = (0, _index.update)(original, { value: [{ a: [_index.$set, 1] }] });
    expect(modified).toEqual({ value: [{ a: 1 }] });
  });

  it("should accept object spec to modify arrays", function () {
    var original = { value: [{ a: 0 }, { a: 0 }] };
    var modified = (0, _index.update)(original, { value: [{ a: [_index.$set, 1] }] });
    expect(modified).toEqual({ value: [{ a: 1 }, { a: 1 }] });
  });
});
//# sourceMappingURL=index.test.js.map