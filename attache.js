module.exports = (function () {
  var getObject = function(obj) {
    if (obj === null || typeof(obj) === "undefined") {
      obj = function(){ return this; }.call();
    }

    if (typeof(obj) !== "object") {
      throw new TypeError();
    }
    
    return obj;
  }  

  var buildFunctionStack = function(obj, fnName) {
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
  var addToContainer = function(obj, name, key, value) {
    if (typeof(obj[name]) === "undefined") {
      obj[name] = {};
    }
  
    if (typeof(obj[name][key]) === "undefined") {
      obj[name][key] = value;
    }
  }

  return {
    add: function(obj, fnName, aspectFn, when, once) {
      obj = getObject(obj);
      var functionStack = buildFunctionStack(obj, fnName);
       
      //Remember original aspect function
      var aspectFnOrigin = aspectFn;
      var aspectObj = this;
    
      for (var idx in functionStack) {
        var funcName = functionStack[idx];
        var currentFunction = obj[funcName];
         
        addToContainer(obj, "origins", funcName, currentFunction);
        addToContainer(obj, "aspectContainer", funcName, { after: [], before: [] });
          
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
    },
    
    remove: function(obj, fnName, aspectFn, when) {
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
    },
  
    after: function(obj, fnName, aspectFn) {
      this.add(obj, fnName, aspectFn, "after");
    },
  
    remove_after: function(obj, fnName, aspectFn) {
      this.remove(obj, fnName, aspectFn, "after");
    },
  
    once_after: function(obj, fnName, aspectFn) {
      this.add(obj, fnName, aspectFn, "after", true);
    },
  
    before: function(obj, fnName, aspectFn) {
      this.add(obj, fnName, aspectFn);
    },
  
    remove_before: function(obj, fnName, aspectFn) {
      this.remove(obj, fnName, aspectFn, "before");
    },
  
    once_before: function(obj, fnName, aspectFn) {
      this.add(obj, fnName, aspectFn, "before", true);
    },
  
    cloneAndExecute: function(container) {
      var cloneCont = [];
      for (var i = 0; i < container.length; i++) {
        cloneCont[i] = container[i];
      }
    
      for (var i = 0; i < cloneCont.length; i++) {
        cloneCont[i]();
      }
    }
  }
})();
