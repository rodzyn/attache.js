function Aspect() {
}

Aspect.prototype.checkConditions = function(obj) {
  if (obj === null || typeof(obj) === "undefined") {
    obj = function(){ return this; }.call();
  }

  if (typeof(obj) !== "object") {
    throw new TypeError();
  }
    
  return obj;
}

Aspect.prototype.buildFunctionStack = function(obj, fnName) {
  var functionStack = [];
    
  if (fnName.constructor === Array) {
      functionStack = fnName;
  }

  if (fnName.constructor === RegExp) {
    for (var key in obj) {
      if (fnName.test(key)) {
          functionStack.push(key);
      }
    }
  }

  if (fnName.constructor === String) {
    functionStack.push(fnName);
  }
    
  return functionStack;  
}

Aspect.prototype.addToContainer = function(obj, name, key, value) {
  if (typeof(obj[name]) === "undefined") {
    obj[name] = {};
  }

  if (typeof(obj[name][key]) === "undefined") {
    obj[name][key] = value;
  }
}

Aspect.prototype.addToContainer = function(obj, name, key, value) {
  if (typeof(obj[name]) === "undefined") {
    obj[name] = {};
  }

  if (typeof(obj[name][key]) === "undefined") {
    obj[name][key] = value;
  }
}

Aspect.prototype.cloneAndExecute = function(container) {
  var cloneCont = [];
  for (var i = 0; i < container.length; i++) {
    cloneCont[i] = container[i];
  }

  for (var i = 0; i < cloneCont.length; i++) {
    cloneCont[i]();
  }
}

Aspect.prototype.add = function(obj, fnName, aspectFn, when, once) {
  obj = this.checkConditions(obj);
  var functionStack = this.buildFunctionStack(obj, fnName);
   
  //Remember original aspect function
  var aspectFnOrigin = aspectFn;
  var aspectObj = this;

  for (var idx in functionStack) {
    var funcName = functionStack[idx];
    var currentFunction = obj[funcName];
     
    this.addToContainer(obj, "origins", funcName, currentFunction);
    this.addToContainer(obj, "aspectContainer", funcName, { after: [], before: [] });
      
    //Managing 'once' condition
    if (once) {
      //Overriding aspect
      var exactAspect = function(funcName) {
        return function(){
          aspectFnOrigin.apply(obj, arguments);
          //Self-removing
          aspectObj.remove(obj, funcName, exactAspect, when);
        } 
      } (functionStack[idx]);
    } else {
      var exactAspect = aspectFn;
    }

    if (when === "after") {
      obj.aspectContainer[funcName].after.push(exactAspect);
    } else {
      obj.aspectContainer[funcName].before.push(exactAspect);
    }

    //Overriding original function with passing proper function into new scope
    obj[funcName] = function(funcName) {
      return function(){
        aspectObj.cloneAndExecute(obj.aspectContainer[funcName].before);
        //Calling original function name and saving return value
        var originalReturn  = obj.origins[funcName].apply(obj, arguments);

        aspectObj.cloneAndExecute(obj.aspectContainer[funcName].after);

        return originalReturn;
      }
    } (functionStack[idx]);
  }
}

Aspect.prototype.remove = function(obj, fnName, aspectFn, when) {
  var properCont = obj.aspectContainer[fnName][when];
  //Finding aspect to remove
  for (var i = 0; i < properCont.length; i++) {
    if (properCont[i] === aspectFn) {
      properCont.splice(i, 1);
    }
  }

  //Restoring original function when all aspects are removed
  var aspectCont = obj.aspectContainer[fnName];
  if (aspectCont.after.length == 0 && aspectCont.before.length == 0) {
      obj[fnName] = obj.origins[fnName];
  }
}

module.exports = new Aspect();

