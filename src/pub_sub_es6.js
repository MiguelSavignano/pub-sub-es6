
// actions = [
//   {
//     name,
//     subscriptions: [ message ]
//   }
// ]
// message { uid, fnc}
var ACTIONS = []
const find                 = (actionName) => ACTIONS.find( action => action.name == actionName)
const findSubscriptions    = (actionName) => find(actionName).subscriptions
const findSubscriptionsFnc = (actionName) => findSubscriptions(actionName).map(message => message.fnc)
const updateACTIONS        = (newSate)    => (ACTIONS = newSate)
const dispatch = (...args) => {
  let actionName = Array.prototype.slice.call(args).shift()
  let action = find(actionName)
  if (!action) return console.warn(`No't found subscriber to the Action ${actionName}`)
  action.subscriptions.forEach(message => {
    message.fnc.call(...args) //send all arguments expect the action name
    debuggerConsole(action.name, message.uid)
  })
}
const receive = (actionName, fnc, uid) => {
  const action = find(actionName) || {name: actionName, subscriptions: []}
  action.subscriptions = [ ...action.subscriptions, { uid, fnc } ]
  debuggerConsole(actionName, uid)
  updateACTIONS([...ACTIONS, action ])
}
const unsubscribe = (actionName, fnc_or_uid) => {
  if(!fnc_or_uid) return console.error("send a function or uid for unsubscribe")
  const key = typeof fnc_or_uid === 'string' ? 'uid' : 'fnc'
  var action = find(actionName)
  action.subscriptions = action.subscriptions.filter(message => message[key] !== fnc_or_uid)
  updateACTIONS([...ACTIONS, action ])
}
const destroyAllActions = () => ACTIONS = []
const actions = () => [...ACTIONS]
//Decorator
const on = function(type) {
  return function when(target, name, descriptor){
    var oldComponentDidMountFnc = target.componentDidMount
    Object.defineProperty(target.constructor.prototype, "componentDidMount", {
        value: function() {
          let reactUid = this._reactInternalInstance._debugID
          let uid = `${reactUid}-${target.constructor.name}`
          receive(type, this[name].bind(this), uid)
          if(oldComponentDidMountFnc) oldComponentDidMountFnc.bind(this)()
        }
      })
   var oldComponentWillUnmountFnc = target.componentWillUnmount
   Object.defineProperty(target.constructor.prototype, "componentWillUnmount", {
        value: function() {
          let reactUid = this._reactInternalInstance._debugID
          let uid = `${reactUid}-${target.constructor.name}`
          unsubscribe(type, uid)
          if(oldComponentWillUnmountFnc) oldComponentWillUnmountFnc.bind(this)()
        }
      })
    return descriptor.value
  }
}
const enableDebugger = false
const debuggerConsole = function(){ enableDebugger && console.log(...arguments) }

//alias
const send             = dispatch
const publish          = dispatch
const broadcast        = dispatch
const addEventListener = receive
export {dispatch, receive, on, unsubscribe,
        actions, find, findSubscriptions, findSubscriptionsFnc}