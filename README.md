[![build status](https://secure.travis-ci.org/rodzyn/attache.js.png)](http://travis-ci.org/rodzyn/attache.js)
Attache.js
==========
### Javascript implementation of Aspect Oriented Programming paradigm, enclosed in Node.js module

#### How to use:

	var attache = require('attache.js');

	attache.after(some_object, "some_object_function", function() {
		// Code which will be executed _after_ some.object.some_function() call	
	});

	attache.once_after(some_object, "some_object_function", function() {
		// Code which will be executed _only once_ after some.object.some_function() call	
	});

	// Removing aspect function
	// Note: basically, we need to have stored aspect function in the value to pass it properly to remove function
	attache.remove_after(some_object, some_object_function, aspect_function);

	attache.before(some_object, "some_object_function", function() {
		// Code which will be executed _before_ some.object.some_function() call	
	});

	attache.once_before(some_object, "some_object_function", function() {
		// Code which will be executed _only once_ before some.object.some_function() call	
	});

	// Removing aspect function
	// Note: basically, we need to have stored aspect function in the value to pass it properly to remove function
	attache.remove_before(some_object, "some_object_function", aspect_function);


### Example:
	attache = require('attache.js');
	
	var obj = {
	  test: function(x) { return x; }
	};
	
	var fake = function() {
	  var fake_val = 100;
	  attache.before(obj, "test", function() {
	  	console.log(fake_val);
		console.log(arguments);    
	  });
	}
	
	fake();
	console.log(obj.test(2, 3, 4));

##### Output:

	100
	{ '0': 2, '1': 3, '2': 4 }
	2