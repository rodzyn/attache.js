var aspect = require('../attache.js');
var assert = require("assert");

var obj = {
  met: function(){}  
}

var foo = 0;
var bar = 1;

var original = obj.met;

var foo_inc = function() { foo++ };
var bar_inc = function() { bar++ };
aspect.add(obj, "met", foo_inc, "after", true);
aspect.add(obj, "met", bar_inc, "before");
aspect.add(obj, "met", foo_inc, "before");

obj.met();
obj.met();

assert.equal(3, bar);
assert.equal(3, foo);

aspect.remove(obj, "met", foo_inc, "after"); //It doeas nothing - already removed
aspect.remove(obj, "met", bar_inc, "before");

obj.met()

assert.equal(3, bar);
assert.equal(4, foo);

assert.notEqual(obj.met, original);

aspect.remove(obj, "met", foo_inc, "before");

assert.equal(obj.met, original);
