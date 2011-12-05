Attache.js
==========
Javascript implementation of Aspect Oriented Programming paradigm enclosed in Node.js module
----------

#### How to use:

	var attache = require('attache.js');

	attache.after(some_object, some_function, function() {
		// Code which will be executed _after_ some.object.some_function() call	
	});

	attache.once_after(some_object, some_function, function() {
		// Code which will be executed __only once__ after some.object.some_function() call	
	});

	// Removing aspect function
	// Note: basically, we need to have stored aspect function in the value to pass it properly to remove function
	attache.remove_after(some_object, some_function, aspect_function);

	attache.before(some_object, some_function, function() {
		// Code which will be executed _before_ some.object.some_function() call	
	});

	attache.once_before(some_object, some_function, function() {
		// Code which will be executed __only once__ before some.object.some_function() call	
	});

	// Removing aspect function
	// Note: basically, we need to have stored aspect function in the value to pass it properly to remove function
	attache.remove_before(some_object, some_function, aspect_function);
