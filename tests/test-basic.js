var aspect = require('../attache.js');
var assert = require("assert");

var bool = false;
var counter = 0;

var obj = {
  x   : 2,
  test: function() { bool = true; },
  sum : function(y) { return this.x + y; }
};

global_function = function(){};

assert.equal(typeof aspect.add, "function", "aspect.add is a function");
assert.equal(typeof aspect.remove, "function", "aspec.remove is a function");
assert.throws(function() {
  aspect.add("fake", "fake", function() { counter++; })
}, TypeError, "Must throw an exception when call for non existing object"); 

aspect.add(null, "global_function", function() { counter ++; });
global_function();
assert.equal(counter, 1, "global function should increase counter");

aspect.add(obj, "test", function() { counter++; });
aspect.add(obj, "sum", function() { counter++; });

obj.test();
assert.equal(bool, true, "changed by aspect");
assert.equal(obj.sum(2), 4, "2 + 2 = 4");
assert.equal(counter, 3, "aspect called 3 times");
