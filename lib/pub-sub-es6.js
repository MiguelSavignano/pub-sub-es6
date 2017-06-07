"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// actions = [
//   {
//     name,
//     subscriptions: [ message ]
//   }
// ]
// message { fnc, uid, fncName }
var ACTIONS = [];

var receive = function receive(actionName, fnc, uid) {
  var uid = uid || _genetageUid();
  var action = find(actionName);
  if (!action) {
    action = { name: actionName, subscriptions: [] };
    ACTIONS.push(action);
  }
  var fncName = fnc.name;
  action.subscriptions.push({ fnc: fnc, uid: uid, fncName: fncName });
  debuggerConsole("receive", "PubSubEs6 | " + uid + " receive " + actionName + " with " + fncName, action);
  return uid;
};

var dispatch = function dispatch() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var actionName = Array.prototype.slice.call(args).shift();
  var action = find(actionName);
  if (!action || action.subscriptions.length == 0) {
    return debuggerConsole("not_found_subscriber", "PubSubEs6 | No't found subscriber to the action " + actionName, action);
  }
  action.subscriptions.forEach(function (message) {
    var _message$fnc;

    (_message$fnc = message.fnc).call.apply(_message$fnc, args); //send all arguments expect the action name
  });
  debuggerConsole("dispatch", "PubSubEs6 | has been dispatch the action: #{actionName}", _extends({}, action, {
    arguments: args.filter(function (item, index) {
      return index != 0;
    })
  }));
  return true;
};

var unsubscribe = function unsubscribe(actionName, fnc_or_uid) {
  if (!fnc_or_uid) return console.error("PubSubEs6 | Send a function or uid for unsubscribe");
  var key = typeof fnc_or_uid === 'string' ? 'uid' : 'fnc';
  var action = find(actionName);
  action.subscriptions = action.subscriptions.filter(function (message) {
    return message[key] !== fnc_or_uid;
  });
  var key_name = key == "fnc" ? fnc_or_uid.name : fnc_or_uid;
  debuggerConsole("unsubscribe", "PubSubEs6 | " + key_name + " unsubscribe for " + actionName, action);
};

//Decorator
var on = function on(actionType) {
  return function on(target, name, descriptor) {
    var oldComponentDidMountFnc = target.componentDidMount;
    var oldComponentWillUnmountFnc = target.componentWillUnmount;

    target.componentDidMount = function () {
      var uid = _generateUidReact({ target: target });
      if (!this.__uids__) this.__uids__ = [];
      this.__uids__.push(uid);
      receive(actionType, this[name].bind(this), uid);
      if (oldComponentDidMountFnc) oldComponentDidMountFnc.bind(this)();
    };

    target.componentWillUnmount = function () {
      this.__uids__ && this.__uids__.map(function (uid) {
        return unsubscribe(actionType, uid);
      });
      if (oldComponentWillUnmountFnc) oldComponentWillUnmountFnc.bind(this)();
    };

    return descriptor.value;
  };
};

// private
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

//helpers

var find = function find(actionName) {
  return ACTIONS.find(function (action) {
    return action.name == actionName;
  });
};

var findSubscriptions = function findSubscriptions(actionName) {
  return find(actionName).subscriptions;
};

var findSubscriptionsFnc = function findSubscriptionsFnc(actionName) {
  return findSubscriptions(actionName).map(function (message) {
    return message.fnc;
  });
};

var destroyAllActions = function destroyAllActions() {
  return ACTIONS = [];
};

var actions = function actions() {
  return [].concat(_toConsumableArray(ACTIONS));
};

var status = function status() {
  actions().map(function (action) {
    var subscriptionMessage = findSubscriptions(action.name).map(function (message) {
      return message.uid + " -> " + message.fnc.name;
    });
    console.log("PubSubEs6 | All subscribers for the action (" + action.name + ") = ", "[ " + subscriptionMessage + " ]");
  });
};

var statusForAction = function statusForAction(action) {
  var subscriptionMessage = findSubscriptions(action.name).map(function (message) {
    return message.uid + " -> " + message.fnc.name;
  });
  console.log("PubSubEs6 | All subscribers for the Action (" + action.name + ") = ", "[ " + subscriptionMessage + " ]");
};

var isDevelopmentMode = function isDevelopmentMode() {
  if (typeof process != 'undefined') {
    return process.env && process.env.NODE_ENV !== 'production';
  }
  return true;
};

var config = {
  enableDebugger: isDevelopmentMode(),
  trace: {
    dispatch: false,
    receive: false,
    unsubscribe: false,
    not_found_subscriber: true
  }
};

var debuggerConsole = function debuggerConsole(type, message, data) {
  if (config.enableDebugger) {
    if (needTrace(type, message, data) && type == "not_found_subscriber") {
      console.warn(message, action);
    } else if (needTrace(type, message, data)) {
      console.info(message, action);
    }
  }
};

var needTrace = function needTrace(type, message, data) {
  if (!config.trace[type]) {
    return false;
  }
  if (typeof config.trace[type] != "boolean") {
    var actions_exepts = config.trace[type].exept;
    var actionName = data.name;
    return actions_exepts.includes(actionName) ? false : true;
  }
};

//alias
var send = dispatch;
var publish = dispatch;
var broadcast = dispatch;
var addEventListener = receive;
var PubSubEs6 = { dispatch: dispatch, receive: receive, on: on, unsubscribe: unsubscribe, status: status,
  actions: actions, find: find, findSubscriptions: findSubscriptions, findSubscriptionsFnc: findSubscriptionsFnc, config: config };
exports.PubSubEs6 = PubSubEs6;
exports.dispatch = dispatch;
exports.receive = receive;
exports.on = on;
exports.unsubscribe = unsubscribe;
exports.status = status;
exports.actions = actions;
exports.find = find;
exports.findSubscriptions = findSubscriptions;
exports.findSubscriptionsFnc = findSubscriptionsFnc;
exports.config = config;
