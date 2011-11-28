var aspect = require('../attache.js');
var assert = require("assert");

var obj = {
  x   : 2,
  sum : function(y) { return this.x + y; }
};

aspect.add(obj, "sum", function(){ obj.x += 1 }, "after", true);

obj.sum(2);
obj.sum(2);

assert.equal(obj.x, 3, "value modified once by aspect");