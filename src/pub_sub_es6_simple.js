export default class PubSubEs6 {
  static dispatch(...args){
    let actionName = Array.prototype.slice.call(args).shift()
    this[`_${actionName}`].forEach(function(fnc){ fnc.call(...args) })
  }
  static receive(action, fnc){
    let actionName = `_${action}`
    if(!this[actionName]) this[actionName] = []
    this[actionName].push(fnc)
  }
}

