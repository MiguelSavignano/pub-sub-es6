"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PubSubEs6 = function () {
  function PubSubEs6() {
    _classCallCheck(this, PubSubEs6);
  }

  _createClass(PubSubEs6, null, [{
    key: "publish",
    value: function publish() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var actionName = Array.prototype.slice.call(args).shift();
      this["_" + actionName].forEach(function (fnc) {
        fnc.call.apply(fnc, args);
      });
    }
  }, {
    key: "when",
    value: function when(action, fnc) {
      var actionName = "_" + action;
      if (!this[actionName]) this[actionName] = [];
      this[actionName].push(fnc);
    }
  }]);

  return PubSubEs6;
}();

exports.default = PubSubEs6;
