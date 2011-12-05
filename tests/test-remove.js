var aspect = require('../attache.js');
var assert = require("assert");

var counter = 0;

var obj = {
  x   : 2,
  sum : function(y) { return this.x + y; }
};

var aspect_func = function(){ counter++; }

aspect.before(obj, "sum", aspect_func);
aspect.after(obj, "sum", aspect_func);
obj.sum(2);
aspect.remove_before(obj, "sum", aspect_func);
obj.sum(2);

assert.equal(counter, 3, "should be executed 3 times");
