!function(n){function t(i){if(r[i])return r[i].exports;var e=r[i]={i:i,l:!1,exports:{}};return n[i].call(e.exports,e,e.exports,t),e.l=!0,e.exports}var r={};t.m=n,t.c=r,t.i=function(n){return n},t.d=function(n,r,i){t.o(n,r)||Object.defineProperty(n,r,{configurable:!1,enumerable:!0,get:i})},t.n=function(n){var r=n&&n.__esModule?function(){return n.default}:function(){return n};return t.d(r,"a",r),r},t.o=function(n,t){return Object.prototype.hasOwnProperty.call(n,t)},t.p="",t(t.s=1)}([function(n,t,r){"use strict";function i(n){if(Array.isArray(n)){for(var t=0,r=Array(n.length);t<n.length;t++)r[t]=n[t];return r}return Array.from(n)}function e(n){var t=n.target,r=t.constructor.name;return f()+"-"+r}Object.defineProperty(t,"__esModule",{value:!0});var u=[],o=function(n,t,r){var r=r||f(),i=l(n),e={fnc:t,uid:r,fncName:t.name};return i?i.subscriptions.push(e):u.push({name:n,subscriptions:[e]}),m(r+" receive "+n+" with",t.name),r},c=function(){for(var n=arguments.length,t=Array(n),r=0;r<n;r++)t[r]=arguments[r];var i=Array.prototype.slice.call(t).shift(),e=l(i);return e&&0!=e.subscriptions.length?(e.subscriptions.forEach(function(n){var r;(r=n.fnc).call.apply(r,t)}),m("dispatch",{actionName:i,subscriptions:e.subscriptions,message:t.filter(function(n,t){return 0!=t})}),!0):console.warn("No't found subscriber to the Action "+i)},s=function(n,t){var r="string"==typeof t?"uid":"fnc",i=l(n);return i.subscriptions=i.subscriptions.filter(function(n){return n[r]!==t}),m(t+" unsubscribe for "+n),t},a=function(n){return function(t,r,i){var u=t.componentDidMount,c=t.componentWillUnmount;return t.componentDidMount=function(){var i=e({target:t});this.__uids__||(this.__uids__=[]),this.__uids__.push(i),o(n,this[r].bind(this),i),u&&u.bind(this)()},t.componentWillUnmount=function(){this.__uids__&&this.__uids__.map(function(t){return s(n,t)}),c&&c.bind(this)()},i.value}},f=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(n){var t=16*Math.random()|0;return("x"==n?t:3&t|8).toString(16)})},p=function(){d().map(function(n){var t=x(n.name).map(function(n){return n.uid+" -> "+n.fnc.name});console.log("All subscribers for the Action ("+n.name+") = ","[ "+t+" ]")})},l=function(n){return u.find(function(t){return t.name==n})},x=function(n){return l(n).subscriptions},b=function(n){return x(n).map(function(n){return n.fnc})},d=function(){return[].concat(i(u))},h={enableDebugger:!1,trace:!1},m=function(){if(h.enableDebugger)if("dispatch"==arguments[0]){var n;(n=console).info.apply(n,arguments)}else if(h.trace){var t;(t=console).info.apply(t,arguments)}},_={dispatch:c,receive:o,on:a,unsubscribe:s,status:p,actions:d,find:l,findSubscriptions:x,findSubscriptionsFnc:b,config:h};t.PubSubEs6=_,t.dispatch=c,t.receive=o,t.on=a,t.unsubscribe=s,t.status=p,t.actions=d,t.find=l,t.findSubscriptions=x,t.findSubscriptionsFnc=b,t.config=h},function(n,t,r){n.exports=r(0)}]);