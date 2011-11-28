var aspect = require('../attache.js');
var assert = require("assert");

var counter = 0;

var obj = {
  x   : 2,
  sum : function(y) { return this.x + y; }
};

aspect.add(obj, "sum", function(){ obj.x = 0 }, "after");
assert.equal(obj.sum(2), 4, "2 + 2 = 4");
assert.equal(obj.x, 0, "value modified by aspect");