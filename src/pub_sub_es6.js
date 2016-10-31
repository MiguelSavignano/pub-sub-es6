export default class PubSubEs6 {
  static publish(...args){
    let actionName = Array.slice(args).shift()
    this[`_${actionName}`].forEach(function(fnc){ fnc.call(...args) })
  }
  static when(action, fnc){
    let actionName = `_${action}`
    if(!this[actionName]) this[actionName] = []
    this[actionName].push(fnc)
  }
}
