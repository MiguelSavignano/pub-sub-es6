/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// actions = [
//   {
//     name,
//     subscriptions: [ message ]
//   }
// ]
// message { fnc, uid, fncName }
var ACTIONS = [];

var receive = exports.receive = function receive(actionName, fnc, uid) {
  var uid = uid || _genetageUid();
  var action = find(actionName);
  if (!action) {
    action = { name: actionName, subscriptions: [] };
    ACTIONS.push(action);
  }
  var fncName = fnc.name;
  action.subscriptions.push({ fnc: fnc, uid: uid, fncName: fncName });
  debuggerConsole(uid + " receive " + actionName + " with", fnc.name);
  return uid;
};

var dispatch = exports.dispatch = function dispatch() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var actionName = Array.prototype.slice.call(args).shift();
  var action = find(actionName);
  if (!action || action.subscriptions.length == 0) return console.warn("No't found subscriber to the Action " + actionName);
  action.subscriptions.forEach(function (message) {
    var _message$fnc;

    (_message$fnc = message.fnc).call.apply(_message$fnc, args); //send all arguments expect the action name
  });
  debuggerConsole("dispatch", {
    actionName: actionName,
    subscriptions: action.subscriptions,
    message: args.filter(function (item, index) {
      return index != 0;
    })
  });
};

var unsubscribe = exports.unsubscribe = function unsubscribe(actionName, fnc_or_uid) {
  if (!fnc_or_uid) return console.error("send a function or uid for unsubscribe");
  var key = typeof fnc_or_uid === 'string' ? 'uid' : 'fnc';
  var action = find(actionName);
  action.subscriptions = action.subscriptions.filter(function (message) {
    return message[key] !== fnc_or_uid;
  });
  debuggerConsole(fnc_or_uid + " unsubscribe for " + actionName);
};

// Decorator
var on = exports.on = function on(actionType) {
  return function on(target, name, descriptor) {
    var oldComponentDidMountFnc = target.componentDidMount;
    var oldComponentWillUnmountFnc = target.componentWillUnmount;

    target.componentDidMount = function () {
      var uid = _generateUidReact({ target: target });
      this.pub_sub_es6_uid = uid;
      receive(actionType, this[name].bind(this), uid);
      if (oldComponentDidMountFnc) oldComponentDidMountFnc.bind(this)();
    };
    target.componentWillUnmount = function () {
      unsubscribe(actionType, this.pub_sub_es6_uid);
      if (oldComponentWillUnmountFnc) oldComponentWillUnmountFnc.bind(this)();
    };
    return descriptor.value;
  };
};

var _genetageUid = function _genetageUid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
};

function _generateUidReact(_ref) {
  var target = _ref.target;

  var componentName = target.constructor.name;
  return _genetageUid() + "-" + componentName;
}

var status = exports.status = function status() {
  actions().map(function (action) {
    var subscriptionMessage = findSubscriptions(action.name).map(function (message) {
      return message.uid + " -> " + message.fnc.name;
    });
    console.log("All subscribers for the Action (" + action.name + ") = ", "[ " + subscriptionMessage + " ]");
  });
};

//helpers

var find = exports.find = function find(actionName) {
  return ACTIONS.find(function (action) {
    return action.name == actionName;
  });
};

var destroyAllSubscriptions = exports.destroyAllSubscriptions = function destroyAllSubscriptions() {
  return ACTIONS = [];
};

var actions = exports.actions = function actions() {
  return [].concat(_toConsumableArray(ACTIONS));
};

var config = exports.config = {
  enableDebugger: false,
  trace: false
};

var debuggerConsole = function debuggerConsole() {
  if (config.enableDebugger) {
    if (arguments[0] == "dispatch") {
      var _console;

      (_console = console).info.apply(_console, arguments);
    } else if (config.trace) {
      var _console2;

      (_console2 = console).info.apply(_console2, arguments);
    }
  }
};
exports.default = PubSubEs6;


var PubSubEs6 = {
  dispatch: dispatch,
  receive: receive,
  on: on,
  unsubscribe: unsubscribe,
  status: status,
  find: find,
  findSubscriptionsFnc: findSubscriptionsFnc,
  config: config
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);