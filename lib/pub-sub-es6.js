'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// actions = [
//   {
//     name,
//     subscriptions: [ message ]
//   }
// ]
// message { fnc, uid, fncName }

var isDevelopmentMode = function isDevelopmentMode() {
  if (typeof process != 'undefined') {
    return process.env && process.env.NODE_ENV !== 'production';
  }
  return true;
};

var PubSubEs6 = function PubSubEs6() {
  var _this = this;

  _classCallCheck(this, PubSubEs6);

  this.receive = function (actionName, fnc, uid) {
    var uid = uid || _this._genetageUid();
    var action = _this.find(actionName);
    if (!action) {
      action = { name: actionName, subscriptions: [] };
      _this.actions.push(action);
    }
    var fncName = fnc.name;
    action.subscriptions.push({ fnc: fnc, uid: uid, fncName: fncName });
    _this.debuggerConsole("receive", 'PubSubEs6 | ' + uid + ' receive ' + actionName + ' with ' + fncName, action);
    return uid;
  };

  this.dispatch = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var actionName = Array.prototype.slice.call(args).shift();
    var action = _this.find(actionName);
    if (!action || action.subscriptions.length == 0) {
      return _this.debuggerConsole("not_found_subscriber", 'PubSubEs6 | No\'t found subscriber to the action ' + actionName, { name: actionName });
    }
    action.subscriptions.forEach(function (message) {
      var _message$fnc;

      (_message$fnc = message.fnc).call.apply(_message$fnc, args); //send all arguments except the action name
    });
    _this.debuggerConsole("dispatch", 'PubSubEs6 | has been dispatch the action: #{actionName}', _extends({}, action, {
      arguments: args.filter(function (item, index) {
        return index != 0;
      })
    }));
    return true;
  };

  this.unsubscribe = function (actionName, fnc_or_uid) {
    if (!fnc_or_uid) return console.error("PubSubEs6 | Send a function or uid for unsubscribe");
    var key = typeof fnc_or_uid === 'string' ? 'uid' : 'fnc';
    var action = _this.find(actionName);
    action.subscriptions = action.subscriptions.filter(function (message) {
      return message[key] !== fnc_or_uid;
    });
    var key_name = key == "fnc" ? fnc_or_uid.name : fnc_or_uid;
    _this.debuggerConsole("unsubscribe", 'PubSubEs6 | ' + key_name + ' unsubscribe for ' + actionName, action);
  };

  this.on = function (actionType) {
    var _generateUidReact = _this._generateUidReact;
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

  this._genetageUid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  };

  this._generateUidReact = function (_ref) {
    var target = _ref.target;

    var componentName = target.constructor.name;
    return _this._genetageUid() + '-' + componentName;
  };

  this.find = function (actionName) {
    return _this.actions.find(function (action) {
      return action.name == actionName;
    });
  };

  this.findSubscriptions = function (actionName) {
    return _this.find(actionName).subscriptions;
  };

  this.destroyAllActions = function () {
    return _this.actions = [];
  };

  this.actions = function () {
    return [].concat(_toConsumableArray(_this.actions));
  };

  this.config = {
    enableDebugger: isDevelopmentMode(),
    trace: {
      dispatch: true,
      receive: false,
      unsubscribe: false,
      not_found_subscriber: true
    }
  };

  this.debuggerConsole = function (type, message, data) {
    // debugger;
    if (this.config.enableDebugger) {
      if (this.needTrace(type, message, data) && type == "not_found_subscriber") {
        console.warn(message, data);
      } else if (this.needTrace(type, message, data)) {
        console.info(message, data);
      }
    }
  };

  this.needTrace = function (type, message, data) {
    if (!_this.config.trace[type]) {
      return false;
    }
    if (typeof _this.config.trace[type] != "boolean") {
      var actions_exepts = _this.config.trace[type].exept;
      var actionName = data.name;
      return actions_exepts.includes(actionName) ? false : true;
    }
    return true;
  };

  this.status = function () {
    _this.actions().map(function (action) {
      var subscriptionMessage = this.findSubscriptions(action.name).map(function (message) {
        return message.uid + ' -> ' + message.fnc.name;
      });
      console.log('PubSubEs6 | All subscribers for the action (' + action.name + ') = ', '[ ' + subscriptionMessage + ' ]');
    });
  };

  this.statusForAction = function (action) {
    var subscriptionMessage = this.findSubscriptions(action.name).map(function (message) {
      return message.uid + ' -> ' + message.fnc.name;
    });
    console.log('PubSubEs6 | All subscribers for the Action (' + action.name + ') = ', '[ ' + subscriptionMessage + ' ]');
  };

  this.actions = [];
}

// Decorator


// private


//helpers

// devtools

;

var pubSubEs6 = new PubSubEs6();
exports.default = pubSubEs6;
var on = pubSubEs6.on,
    dispatch = pubSubEs6.dispatch,
    unsubscribe = pubSubEs6.unsubscribe,
    receive = pubSubEs6.receive,
    config = pubSubEs6.config,
    status = pubSubEs6.status,
    findSubscriptions = pubSubEs6.findSubscriptions;
exports.on = on;
exports.dispatch = dispatch;
exports.unsubscribe = unsubscribe;
exports.receive = receive;
exports.config = config;
exports.status = status;
exports.findSubscriptions = findSubscriptions;
