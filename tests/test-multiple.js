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
aspect.once_after(obj, "met", foo_inc);
aspect.before(obj, "met", bar_inc);
aspect.before(obj, "met", foo_inc);

obj.met();
obj.met();

assert.equal(3, bar);
assert.equal(3, foo);

aspect.remove_after(obj, "met", foo_inc); //It doeas nothing - already removed
aspect.remove_before(obj, "met", bar_inc);

obj.met()

assert.equal(3, bar);
assert.equal(4, foo);

assert.notEqual(obj.met, original);

aspect.remove_before(obj, "met", foo_inc);

assert.equal(obj.met, original);
