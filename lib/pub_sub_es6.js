'use strict';

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
var genetageUid = function genetageUid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
};

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
var dispatch = function dispatch() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var actionName = Array.prototype.slice.call(args).shift();
  var action = find(actionName);
  if (!action || action.subscriptions.length == 0) return console.warn('No\'t found subscriber to the Action ' + actionName);
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
var receive = function receive(actionName, fnc, uid) {
  var uid = uid || genetageUid();
  var action = find(actionName);
  if (!action) {
    action = { name: actionName, subscriptions: [] };
    ACTIONS.push(action);
  }
  var fncName = fnc.name;
  action.subscriptions.push({ fnc: fnc, uid: uid, fncName: fncName });
  debuggerConsole(uid + ' receive ' + actionName + ' with', fnc.name);
  return uid;
};
var unsubscribe = function unsubscribe(actionName, fnc_or_uid) {
  if (!fnc_or_uid) return console.error("send a function or uid for unsubscribe");
  var key = typeof fnc_or_uid === 'string' ? 'uid' : 'fnc';
  var action = find(actionName);
  action.subscriptions = action.subscriptions.filter(function (message) {
    return message[key] !== fnc_or_uid;
  });
  debuggerConsole(fnc_or_uid + ' unsubscribe for ' + actionName);
};
var destroyAllActions = function destroyAllActions() {
  return ACTIONS = [];
};
var actions = function actions() {
  return [].concat(_toConsumableArray(ACTIONS));
};
//Decorator
var on = function on(actionType) {
  var uid = _generateUidReact({ target: target });
  return function on(target, name, descriptor) {
    var oldComponentDidMountFnc = target.componentDidMount;
    target.componentDidMount = function () {
      receive(actionName, this[name].bind(this), uid);
      if (oldComponentDidMountFnc) oldComponentDidMountFnc.bind(this)();
    };
    var oldComponentWillUnmountFnc = target.componentWillUnmount;
    target.componentWillUnmount = function () {
      unsubscribe(actionType, uid);
      if (oldComponentWillUnmountFnc) oldComponentWillUnmountFnc.bind(this)();
    };
    return descriptor.value;
  };
};
var status = function status() {
  actions().map(function (action) {
    var subscriptionMessage = findSubscriptions(action.name).map(function (message) {
      return message.uid + ' -> ' + message.fnc.name;
    });
    console.log('All subscribers for the Action (' + action.name + ') = ', '[ ' + subscriptionMessage + ' ]');
  });
};

var config = {
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

function _generateUidReact(_ref) {
  var target = _ref.target,
      scopeValue = _ref.scopeValue;

  var reactUid = genetageUid();
  var componentName = target.constructor.name;
  return reactUid + '-' + componentName;
}

//alias
var send = dispatch;
var publish = dispatch;
var broadcast = dispatch;
var addEventListener = receive;
var PubSubEs6 = { dispatch: dispatch, receive: receive, on: on, unsubscribe: unsubscribe, status: status,
  actions: actions, find: find, findSubscriptions: findSubscriptions, findSubscriptionsFnc: findSubscriptionsFnc, config: config };
exports.dispatch = dispatch;
exports.receive = receive;
exports.on = on;
exports.unsubscribe = unsubscribe;
exports.status = status;
exports.actions = actions;
exports.find = find;
exports.findSubscriptions = findSubscriptions;
exports.findSubscriptionsFnc = findSubscriptionsFnc;
exports.PubSubEs6 = PubSubEs6;
exports.config = config;
