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
// message { uid, fnc}
var ACTIONS = [];
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
var updateACTIONS = function updateACTIONS(newSate) {
  return ACTIONS = newSate;
};
var dispatch = function dispatch() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var actionName = Array.prototype.slice.call(args).shift();
  var action = find(actionName);
  if (!action) return console.warn('No\'t found subscriber to the Action ' + actionName);
  action.subscriptions.forEach(function (message) {
    var _message$fnc;

    return (_message$fnc = message.fnc).call.apply(_message$fnc, args);
  }); //send all arguments except the action name
};
var receive = function receive(actionName, fnc, uid) {
  var action = find(actionName) || { name: actionName, subscriptions: [] };
  action.subscriptions = [].concat(_toConsumableArray(action.subscriptions), [{ uid: uid, fnc: fnc }]);
  updateACTIONS([].concat(_toConsumableArray(ACTIONS), [action]));
};
var unsubscribe = function unsubscribe(actionName, fnc_or_uid) {
  if (!fnc_or_uid) return console.error("send a function or uid for unsubscribe");
  var key = typeof fnc_or_uid === 'string' ? 'uid' : 'fnc';
  var action = find(actionName);
  action.subscriptions = action.subscriptions.filter(function (message) {
    return message[key] !== fnc_or_uid;
  });
  updateACTIONS([].concat(_toConsumableArray(ACTIONS), [action]));
};
var destroyAllActions = function destroyAllActions() {
  return ACTIONS = [];
};
var actions = function actions() {
  return [].concat(_toConsumableArray(ACTIONS));
};
//Decorator
var when = function when(type) {
  return function when(target, name, descriptor) {
    var oldComponentDidMountFnc = target.componentDidMount;
    Object.defineProperty(target.constructor.prototype, "componentDidMount", {
      value: function value() {
        receive(type, this[name].bind(this));
        if (oldComponentDidMountFnc) oldComponentDidMountFnc();
      }
    });
    return descriptor.value;
  };
};

//alias
var send = dispatch;
var publish = dispatch;
var broadcast = dispatch;
var on = receive;
var addEventListener = receive;
exports.dispatch = dispatch;
exports.receive = receive;
exports.unsubscribe = unsubscribe;
exports.actions = actions;
exports.send = send;
exports.publish = publish;
exports.broadcast = broadcast;
exports.on = on;
exports.when = when;
exports.addEventListener = addEventListener;
