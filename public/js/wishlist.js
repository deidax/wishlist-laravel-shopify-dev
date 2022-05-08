/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! regenerator-runtime */ "./node_modules/regenerator-runtime/runtime.js");


/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/***/ ((module) => {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : 0
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************************!*\
  !*** ./resources/js/wishlist.js ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

// APIs Enum
var API = {
  ADD: '/api/add-to-wishlist',
  REMOVE: '/api/remove-from-wishlist',
  CHECK: '/api/check-wishlist',
  UPDATE_CUSTOMER_ID: '/api/update-customer-id-wishlist',
  BUILD_WISHLIST_BUTTON: '/api/get-button-params',
  SOCIAL_COUNT: '/api/get-social-count'
}; // Wishlist button

var WISHLIST_BUTTON = {
  BUTTON_DATA: 'ws_button_data',
  BUTTON_HANDLE: 'wh_button_handle',
  BUTTON_TEXT_WRAPPER_BEFORE: 'addto_wl_text_wrapp_before',
  BUTTON_TEXT_WRAPPER_AFTER: 'addto_wl_text_wrapp_after'
}; // APP URL

var APP_URL = 'https://dev.myshopifyapp.com';
var cookies_days = 365; // Regular expression to check if string is a valid UUID

var regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi; //display button process?

var display_button_process = false; // Display social count?

var display_social_count = false; // Class To manage Wishlist states

var WishlistManager = /*#__PURE__*/function () {
  function WishlistManager(wishlist_button_selector) {
    _classCallCheck(this, WishlistManager);

    // select the wishlist button
    this.button = document.querySelector('#' + wishlist_button_selector);
    this.appStorageManager = new AppStorageManager();
    this.product_id = product_json.id;
    this.product_price = this.button.dataset.product_price.replace(',', ''); // Customer id

    this.customer_id = this.button.dataset.customer != "" ? this.button.dataset.customer : this.appStorageManager.checkIfNotSetLocalStorage('ws_customer', this.uuidv4()); // Create a uuidv4 id to use later

    if (regexExp.test(this.customer_id)) {
      // This will be used to update the customer id in the backend
      this.appStorageManager.setLocalStorage('ws_uuid_customer_id', this.customer_id);
    } //set customer_id cookie


    this.appStorageManager.setLocalStorage('ws_customer', this.customer_id); // Data to send to the Api

    this.data = {
      'shop_id': Shopify.shop,
      'product_id': this.product_id,
      'product_price': this.product_price,
      'product_data': product_json,
      'customer_id': this.customer_id,
      'uuid_customer_id': this.appStorageManager.getLocalStorage('ws_uuid_customer_id')
    };
    console.log('data', this.data); //default state is CheckWishlist 

    this.initWishlist();
  }

  _createClass(WishlistManager, [{
    key: "initWishlist",
    value: function initWishlist() {
      //default state is CheckWishlist 
      // let updateCustomerIdWishlist = this.updateCustomerIdWishlist()
      // let initState = updateCustomerIdWishlist.checkIfCustomerConnected()
      // initState.buttonSwitch()
      // initState.nextState()
      var buildButton = this.buildWishlistButton();
      buildButton.callApi();
    }
  }, {
    key: "isWishlistButtonActive",
    value: function isWishlistButtonActive() {
      return this.button.firstChild.classList.contains('active');
    }
  }, {
    key: "buildWishlistButton",
    value: function buildWishlistButton() {
      return new BuildWishlistButton(this.button, this.data);
    }
  }, {
    key: "addToWishlist",
    value: function addToWishlist() {
      return new AddToWishlist(this.button, this.data);
    }
  }, {
    key: "removeFromWishlist",
    value: function removeFromWishlist() {
      return new RemoveFromWishlist(this.button, this.data);
    }
  }, {
    key: "checkWishlist",
    value: function checkWishlist() {
      return new CheckWishlist(this.button, this.data);
    }
  }, {
    key: "updateCustomerIdWishlist",
    value: function updateCustomerIdWishlist() {
      return new UpdateCustomerIdWishlist(this.button, this.data);
    } // create a unique id (will be used for customer)

  }, {
    key: "uuidv4",
    value: function uuidv4() {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
        return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
      });
    } // add js cdn

  }, {
    key: "javascriptCdn",
    value: function javascriptCdn(cdn) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = cdn;
      document.body.appendChild(script);
    } // add css cdn

  }, {
    key: "cssCdn",
    value: function cssCdn(cdn) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cdn;
      document.body.appendChild(link);
    }
  }]);

  return WishlistManager;
}(); // Super abstract class for wishlist apis


var WishlistApi = /*#__PURE__*/function () {
  function WishlistApi(api, button) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, WishlistApi);

    if (this.constructor == WishlistApi) throw new Error(" Object of Abstract Class cannot be created");
    this.end_point = APP_URL + api;
    this.button = button;
    this.appStorageManager = new AppStorageManager();
    this.data = data;
  }

  _createClass(WishlistApi, [{
    key: "getCustomizedButton",
    value: function getCustomizedButton() {
      var customized_wishlist_button = document.querySelector('#' + WISHLIST_BUTTON.BUTTON_HANDLE);
      return customized_wishlist_button;
    }
  }, {
    key: "setWishListButtonToActive",
    value: function setWishListButtonToActive() {
      this.getCustomizedButton().style.pointerEvents = 'auto';
      this.getCustomizedButton().classList.add('active');
      var text_loading = this.getCustomizedButton().querySelector('#text_loading');
      var wl_text_wrapp_before = this.getCustomizedButton().querySelector('#' + WISHLIST_BUTTON.BUTTON_TEXT_WRAPPER_BEFORE);
      var wl_text_wrapp_after = this.getCustomizedButton().querySelector('#' + WISHLIST_BUTTON.BUTTON_TEXT_WRAPPER_AFTER);
      if (text_loading != null) text_loading.style.display = 'none';
      wl_text_wrapp_before.style.display = 'block';
      wl_text_wrapp_after.style.display = 'none';
    }
  }, {
    key: "setWishListButtonToInActive",
    value: function setWishListButtonToInActive() {
      this.getCustomizedButton().style.pointerEvents = 'auto';
      this.getCustomizedButton().classList.remove('active');
      var text_loading = this.getCustomizedButton().querySelector('#text_loading');
      var wl_text_wrapp_before = this.getCustomizedButton().querySelector('#' + WISHLIST_BUTTON.BUTTON_TEXT_WRAPPER_BEFORE);
      var wl_text_wrapp_after = this.getCustomizedButton().querySelector('#' + WISHLIST_BUTTON.BUTTON_TEXT_WRAPPER_AFTER);
      if (text_loading != null) text_loading.style.display = 'none';
      wl_text_wrapp_before.style.display = 'none';
      wl_text_wrapp_after.style.display = 'block';
    }
  }, {
    key: "setTextForWishListButton",
    value: function setTextForWishListButton(text) {
      //set text loading span
      this.getCustomizedButton().style.pointerEvents = 'none';
      console.log('cursor', this.getCustomizedButton().style.pointerEvents);
      this.getCustomizedButton().querySelector("#text_loading") != undefined ? (this.getCustomizedButton().querySelector("#text_loading").style.display = 'block', this.getCustomizedButton().querySelector("#text_loading").innerHTML = text) : this.getCustomizedButton().insertAdjacentHTML("afterbegin", "<span id='text_loading'>" + text + "</span>");
      console.log(text);
      console.log('this.getCustomizedButton().querySelector("#text_loading")', this.getCustomizedButton().querySelector("#text_loading"));
      this.getCustomizedButton().querySelector('#' + WISHLIST_BUTTON.BUTTON_TEXT_WRAPPER_BEFORE).style.display = 'none';
      this.getCustomizedButton().querySelector('#' + WISHLIST_BUTTON.BUTTON_TEXT_WRAPPER_AFTER).style.display = 'none';
    } // calculate social count

  }, {
    key: "socialCountCalculation",
    value: function socialCountCalculation() {
      if (display_social_count) {
        var social_count = new SocialCountCalculation(this.button, this.data);
        social_count.callApi();
      }
    } // These methods should be implemented (override)

  }, {
    key: "callApi",
    value: function callApi() {
      throw new Error('You have to implement the method callApi');
    }
  }, {
    key: "buttonSwitch",
    value: function buttonSwitch() {
      throw new Error('You have to implement the method buttonSwitch');
    } //post

  }, {
    key: "postData",
    value: function () {
      var _postData = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee() {
        var data,
            response,
            _args = arguments;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                data = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
                _context.next = 3;
                return fetch(this.end_point, {
                  method: 'POST',
                  // *GET, POST, PUT, DELETE, etc.
                  mode: 'cors',
                  // no-cors, *cors, same-origin
                  cache: 'no-cache',
                  // *default, no-cache, reload, force-cache, only-if-cached
                  credentials: 'same-origin',
                  // include, *same-origin, omit
                  headers: {
                    'Content-Type': 'application/json' // 'Content-Type': 'application/x-www-form-urlencoded',

                  },
                  redirect: 'follow',
                  // manual, *follow, error
                  referrerPolicy: 'no-referrer',
                  // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                  body: JSON.stringify(data) // body data type must match "Content-Type" header

                });

              case 3:
                response = _context.sent;
                return _context.abrupt("return", response.json());

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function postData() {
        return _postData.apply(this, arguments);
      }

      return postData;
    }()
  }]);

  return WishlistApi;
}();

var BuildWishlistButton = /*#__PURE__*/function (_WishlistApi) {
  _inherits(BuildWishlistButton, _WishlistApi);

  var _super = _createSuper(BuildWishlistButton);

  function BuildWishlistButton(button, data) {
    var _this;

    _classCallCheck(this, BuildWishlistButton);

    _this = _super.call(this, API.BUILD_WISHLIST_BUTTON, button, data);
    _this.shop_data = {
      'shop_id': Shopify.shop,
      'shop_active_theme_id': Shopify.theme.id
    };
    return _this;
  }

  _createClass(BuildWishlistButton, [{
    key: "nextState",
    value: function nextState() {
      console.log('build called!');
      var nextState = new UpdateCustomerIdWishlist(this.button, this.data);
      return nextState;
    }
  }, {
    key: "buttonSwitch",
    value: function buttonSwitch() {
      var innerText = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      return;
    }
  }, {
    key: "pleaseActivateWishlistTheme",
    value: function pleaseActivateWishlistTheme(activation_message) {
      this.button.innerText = activation_message !== null && activation_message !== void 0 ? activation_message : 'Please activate wishlist theme in app settings';
    }
  }, {
    key: "callApi",
    value: function callApi() {
      var _this2 = this;

      console.log(this.end_point); //let loadingState = new LoadingWishlistNextState(null, this.button)
      //loadingState.buttonSwitch('Adding to wishlist...')

      _get(_getPrototypeOf(BuildWishlistButton.prototype), "postData", this).call(this, this.shop_data).then(function (response) {
        // return 
        if (response.type != undefined && response.type == "error") {
          _this2.pleaseActivateWishlistTheme(response.message);
        } else {
          _this2.button.innerHTML = response.innerHtml;
          display_social_count = response.display_social_count;

          _get(_getPrototypeOf(BuildWishlistButton.prototype), "getCustomizedButton", _this2).call(_this2).setAttribute("onclick", "myFunction();");

          var updateCustomerIdWishlist = _this2.nextState();

          var checkWishlist = updateCustomerIdWishlist.checkIfCustomerConnected();

          _get(_getPrototypeOf(BuildWishlistButton.prototype), "socialCountCalculation", _this2).call(_this2); //checkWishlist.nextState()
          // updateCustomerIdWishlist.buttonSwitch()
          //updateCustomerIdWishlist.nextState()

        }
      })["catch"](function (error) {
        // fire error notification
        console.log(error);
      });
    }
  }]);

  return BuildWishlistButton;
}(WishlistApi);

var AddToWishlist = /*#__PURE__*/function (_WishlistApi2) {
  _inherits(AddToWishlist, _WishlistApi2);

  var _super2 = _createSuper(AddToWishlist);

  function AddToWishlist(button, data) {
    _classCallCheck(this, AddToWishlist);

    return _super2.call(this, API.ADD, button, data);
  }

  _createClass(AddToWishlist, [{
    key: "buttonSwitch",
    value: function buttonSwitch() {
      // if(this.button.disabled) this.button.disabled = false
      _get(_getPrototypeOf(AddToWishlist.prototype), "setWishListButtonToActive", this).call(this); // this.button.innerText = "Add To Wishlist";

    } //set next state to follow

  }, {
    key: "nextState",
    value: function nextState() {
      var nextState = new RemoveFromWishlist(this.button, this.data);
      return nextState;
    }
  }, {
    key: "callApi",
    value: function callApi() {
      var _this3 = this;

      console.log(this.end_point);

      if (display_button_process) {
        var loadingState = new LoadingWishlistNextState(null, this.button);
        loadingState.buttonSwitch('Adding to wishlist...');
      } else {
        this.nextState().buttonSwitch();
      }

      _get(_getPrototypeOf(AddToWishlist.prototype), "postData", this).call(this, this.data).then(function (response) {
        _this3.appStorageManager.addProductsIdToLocalStorage(_this3.data.product_data);

        _get(_getPrototypeOf(AddToWishlist.prototype), "socialCountCalculation", _this3).call(_this3);

        notification(response.type, response.message);
        return _this3.nextState().buttonSwitch();
      })["catch"](function (error) {
        // fire error notification
        console.log('error', error);
        notification('error', 'Oops!!.. something is wrong.\n can\'t add product to wishlist :(');
      });
    }
  }]);

  return AddToWishlist;
}(WishlistApi);

var RemoveFromWishlist = /*#__PURE__*/function (_WishlistApi3) {
  _inherits(RemoveFromWishlist, _WishlistApi3);

  var _super3 = _createSuper(RemoveFromWishlist);

  function RemoveFromWishlist(button, data) {
    _classCallCheck(this, RemoveFromWishlist);

    return _super3.call(this, API.REMOVE, button, data);
  }

  _createClass(RemoveFromWishlist, [{
    key: "buttonSwitch",
    value: function buttonSwitch() {
      //if(this.button.disabled) this.button.disabled = false
      _get(_getPrototypeOf(RemoveFromWishlist.prototype), "setWishListButtonToInActive", this).call(this);
    }
  }, {
    key: "nextState",
    value: function nextState() {
      var nextState = new AddToWishlist(this.button, this.data);
      return nextState;
    }
  }, {
    key: "callApi",
    value: function callApi() {
      var _this4 = this;

      console.log(this.end_point);

      if (display_button_process) {
        var loadingState = new LoadingWishlistNextState(null, this.button);
        loadingState.buttonSwitch('Removing from wishlist...');
      } else {
        this.nextState().buttonSwitch();
      }

      _get(_getPrototypeOf(RemoveFromWishlist.prototype), "postData", this).call(this, this.data).then(function (response) {
        _this4.appStorageManager.removeProductsIdFromLocalStorage(_this4.data.product_data);

        _get(_getPrototypeOf(RemoveFromWishlist.prototype), "socialCountCalculation", _this4).call(_this4);

        notification(response.type, response.message);
        return _this4.nextState().buttonSwitch();
      })["catch"](function (error) {
        // fire error notification
        notification('error', 'Oops!!.. something is wrong.\n can\'t add product to wishlist :(');
      });
    }
  }]);

  return RemoveFromWishlist;
}(WishlistApi);

var CheckWishlist = /*#__PURE__*/function (_WishlistApi4) {
  _inherits(CheckWishlist, _WishlistApi4);

  var _super4 = _createSuper(CheckWishlist);

  function CheckWishlist(button, data) {
    _classCallCheck(this, CheckWishlist);

    return _super4.call(this, API.CHECK, button, data);
  }

  _createClass(CheckWishlist, [{
    key: "nextState",
    value: function nextState() {
      // check if products is already in products cookie
      // if product exist in products cookie we don't need to do an api call, and we move to the next button state
      var products_ids_cookie = this.appStorageManager.getLocalStorage('ws_products');

      if (products_ids_cookie != "" && products_ids_cookie != null) {
        // get the products ids into array
        var products_ids = JSON.parse(products_ids_cookie); // check if product in cookie
        // if true button state should be on the Remove

        if (products_ids.includes(this.data.product_id)) {
          var nextState = new RemoveFromWishlist(this.button, this.data);
          return nextState.buttonSwitch();
        } //if not, we should double check if product exists in the backend and add it again to product cookie


        this.callApi();
      } // The ws_products cookie could be empty or it doesn't exist so we double check the backend,
      // and we move to the next State


      this.callApi();
    }
  }, {
    key: "buttonSwitch",
    value: function buttonSwitch() {// this.button.classList.add('active');
      // this.button.innerText = "Add To Wishlist";
      // return "Add To Wishlist";
    }
  }, {
    key: "callApi",
    value: function callApi() {
      var _this5 = this;

      console.log(this.end_point);

      if (display_button_process) {
        var loadingState = new LoadingWishlistNextState(null, this.button);
        loadingState.buttonSwitch('Checking wishlist...');
      }

      _get(_getPrototypeOf(CheckWishlist.prototype), "postData", this).call(this, this.data).then(function (response) {
        console.log('checklist respinse', response);
        var nextState = null;

        if (response === 1) {
          // add the product id to the cookie and set the button next state
          _this5.appStorageManager.addProductsIdToLocalStorage(_this5.data.product_data);

          nextState = new RemoveFromWishlist(_this5.button, _this5.data);
          return nextState.buttonSwitch();
        }

        nextState = new AddToWishlist(_this5.button, _this5.data);
        return nextState.buttonSwitch();
      })["catch"](function (error) {
        // fire error notification
        console.log('error', error);
        notification('error', 'Oops!!.. something is wrong.\n can\'t add product to wishlist :(');
      });
    }
  }]);

  return CheckWishlist;
}(WishlistApi);

var UpdateCustomerIdWishlist = /*#__PURE__*/function (_WishlistApi5) {
  _inherits(UpdateCustomerIdWishlist, _WishlistApi5);

  var _super5 = _createSuper(UpdateCustomerIdWishlist);

  function UpdateCustomerIdWishlist(button, data) {
    _classCallCheck(this, UpdateCustomerIdWishlist);

    return _super5.call(this, API.UPDATE_CUSTOMER_ID, button, data);
  }

  _createClass(UpdateCustomerIdWishlist, [{
    key: "buttonSwitch",
    value: function buttonSwitch() {
      return;
    }
  }, {
    key: "nextState",
    value: function nextState() {
      var nextState = new CheckWishlist(this.button, this.data);
      nextState.nextState();
      return nextState;
    } // Check if customer is connected and update db user id with customer's shopifyId

  }, {
    key: "checkIfCustomerConnected",
    value: function checkIfCustomerConnected() {
      var c_uuid = this.appStorageManager.getLocalStorage('ws_customer'); //get customer uuid from cookies

      var products_ids_cookie = this.appStorageManager.getLocalStorage('ws_products'); //get customer uuid from cookies

      var products_ids = [];

      if (products_ids_cookie != "" && products_ids_cookie != null) {
        products_ids = JSON.parse(products_ids_cookie);
      }

      if (c_uuid != "" && c_uuid != null && _typeof(c_uuid) != undefined && !regexExp.test(c_uuid) && this.button.dataset.customer != "" && products_ids.length > 0) {
        return this.callApi();
      }

      return this.nextState();
    }
  }, {
    key: "callApi",
    value: function callApi() {
      var _this6 = this;

      console.log(this.end_point);

      if (display_button_process) {
        var loadingState = new LoadingWishlistNextState(null, this.button);
        loadingState.buttonSwitch('Checking customer...');
      } else {
        this.nextState();
      }

      _get(_getPrototypeOf(UpdateCustomerIdWishlist.prototype), "postData", this).call(this, this.data).then(function (response) {
        _this6.appStorageManager.setLocalStorage('ws_customer', _this6.data.customer_id);

        return _this6.nextState();
      })["catch"](function (error) {
        // fire error notification
        console.log('error', error);
      });
    }
  }]);

  return UpdateCustomerIdWishlist;
}(WishlistApi);

var LoadingWishlistNextState = /*#__PURE__*/function (_WishlistApi6) {
  _inherits(LoadingWishlistNextState, _WishlistApi6);

  var _super6 = _createSuper(LoadingWishlistNextState);

  function LoadingWishlistNextState() {
    _classCallCheck(this, LoadingWishlistNextState);

    return _super6.apply(this, arguments);
  }

  _createClass(LoadingWishlistNextState, [{
    key: "callApi",
    value: function callApi() {
      return;
    }
  }, {
    key: "buttonSwitch",
    value: function buttonSwitch() {
      var innerText = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      _get(_getPrototypeOf(LoadingWishlistNextState.prototype), "setTextForWishListButton", this).call(this, innerText);
    }
  }]);

  return LoadingWishlistNextState;
}(WishlistApi);

var SocialCountCalculation = /*#__PURE__*/function (_WishlistApi7) {
  _inherits(SocialCountCalculation, _WishlistApi7);

  var _super7 = _createSuper(SocialCountCalculation);

  function SocialCountCalculation(button, data) {
    _classCallCheck(this, SocialCountCalculation);

    return _super7.call(this, API.SOCIAL_COUNT, button, data);
  }

  _createClass(SocialCountCalculation, [{
    key: "callApi",
    value: function callApi() {
      var _this7 = this;

      console.log(this.end_point);

      _get(_getPrototypeOf(SocialCountCalculation.prototype), "postData", this).call(this, this.data).then(function (response) {
        _this7.buttonSwitch(response);
      })["catch"](function (error) {
        // fire error notification
        console.log('error', error);
      });
    }
  }, {
    key: "buttonSwitch",
    value: function buttonSwitch() {
      var innerText = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var count = document.querySelector('#wp_count');
      count.innerHTML = '(' + innerText + ')';
    }
  }]);

  return SocialCountCalculation;
}(WishlistApi);

var AppStorageManager = /*#__PURE__*/function () {
  function AppStorageManager() {
    _classCallCheck(this, AppStorageManager);
  }

  _createClass(AppStorageManager, [{
    key: "checkIfNotSetLocalStorage",
    value: // Check if cookie is set
    function checkIfNotSetLocalStorage(cname, default_cvalue) {
      var cvalue = localStorage.getItem(cname);
      console.log('**--> cvalue != null', cvalue != null);
      cvalue = cvalue != null ? cvalue : default_cvalue;
      console.log('**--> cvalue', cvalue);
      return cvalue;
    } // Get cookie value

  }, {
    key: "getLocalStorage",
    value: function getLocalStorage(cname) {
      // let name = cname + "=";
      // let decodedCookie = decodeURIComponent(document.cookie);
      // let ca = decodedCookie.split(';');
      // for(let i = 0; i <ca.length; i++) {
      //     let c = ca[i];
      //     while (c.charAt(0) == ' ') {
      //         c = c.substring(1);
      //     }
      //     if (c.indexOf(name) == 0) {
      //         return c.substring(name.length, c.length);
      //     }
      // }
      // return "";
      return localStorage.getItem(cname);
    } // Set cookie if customer is not authenticated

  }, {
    key: "setLocalStorage",
    value: function setLocalStorage(cname, cvalue) {
      var exdays = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : cookies_days;
      // const d = new Date();
      // d.setTime(d.getTime() + (exdays*24*60*60*1000));
      // let expires = "expires="+ d.toUTCString();
      // document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      localStorage.setItem(cname, cvalue);
    } // Delete cookie

  }, {
    key: "deleteLocalStorage",
    value: function deleteLocalStorage(cname) {
      // document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      localStorage.removeItem(cname);
    }
  }, {
    key: "addProductsIdToLocalStorage",
    value: function addProductsIdToLocalStorage(product_data) {
      // Get value of ws_products cookie
      var products_ids_cookie = this.getLocalStorage('ws_products'); // Check if it's not null or empty

      products_ids_cookie = products_ids_cookie ? JSON.parse(products_ids_cookie) : []; // Push new product id into array (without duplicates)

      if (!products_ids_cookie.find(function (p) {
        return p.id === product_data.id;
      })) products_ids_cookie.push(product_data); // set the new cookie value for products

      this.setLocalStorage('ws_products', JSON.stringify(products_ids_cookie));
    }
  }, {
    key: "removeProductsIdFromLocalStorage",
    value: function removeProductsIdFromLocalStorage(product_data) {
      // Get value of ws_products cookie
      var products_ids_cookie = this.getLocalStorage('ws_products');

      if (products_ids_cookie) {
        products_ids_cookie = JSON.parse(products_ids_cookie);
        products_ids_cookie = products_ids_cookie.filter(function (p) {
          return p.id !== product_data.id;
        });
        this.setLocalStorage('ws_products', JSON.stringify(products_ids_cookie));
      }
    }
  }, {
    key: "setCookie",
    value: function setCookie(cname, cvalue, days) {
      var dt, expires;
      dt = new Date();
      dt.setTime(dt.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + dt.toGMTString();
      document.cookie = cname + "=" + cvalue + expires + '; domain=' + Shopify.shop;
    }
  }, {
    key: "getCookie",
    value: function getCookie(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');

      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];

        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }

        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }

      return "";
    }
  }]);

  return AppStorageManager;
}(); // usage


var wishlistManager = new WishlistManager(WISHLIST_BUTTON.BUTTON_DATA); // noty cdn

wishlistManager.javascriptCdn('https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.js');
wishlistManager.cssCdn('https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.css'); // font awesome

wishlistManager.cssCdn('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css');

function myFunction() {
  // Add to wishlist if button is active
  // switch button label after adding product to wishlist (Remove from wishlist)
  if (wishlistManager.isWishlistButtonActive()) {
    wishlistManager.addToWishlist().callApi();
  } // Remove product from wishlist if buuton is not active
  // switch button label after removing from wishlist (Add to wishlist)
  else {
    wishlistManager.removeFromWishlist().callApi();
  }
} // notify user


function notification(type, text) {
  new Noty({
    type: type,
    layout: 'topRight',
    text: text,
    timeout: 3000
  }).show();
}
})();

/******/ })()
;