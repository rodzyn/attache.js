var aspect = require('../attache.js');
var assert = require("assert");

var counter = 0;

var obj = {
  x   : 2,
  sum : function(y) { return this.x + y; }
};

var aspect_func = function(){ counter++; }

aspect.add(obj, "sum", aspect_func, "before");
aspect.add(obj, "sum", aspect_func, "after");
obj.sum(2);
aspect.remove(obj, "sum", aspect_func, "before");
obj.sum(2);

assert.equal(counter, 3, "should be executed 3 times");
