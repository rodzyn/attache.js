var aspect = require('../attache.js');
var assert = require("assert");

var obj = {
  foo: function(){},
  foooo: function(){}
}

var counter = 0;

aspect.add(obj, /^fo(.*)$/, function() { counter++ })

obj.foo();
obj.foooo();

assert.equal(counter, 2);

