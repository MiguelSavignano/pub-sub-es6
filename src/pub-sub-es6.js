
// actions = [
//   {
//     name,
//     subscriptions: [ message ]
//   }
// ]
// message { fnc, uid, fncName }
var ACTIONS = []

const receive = (actionName, fnc, uid) => {
  var uid = uid || _genetageUid()
  var action = find(actionName)
  if(!action){
    action = {name: actionName, subscriptions: []}
    ACTIONS.push(action)
  }
  const fncName = fnc.name
  action.subscriptions.push({ fnc, uid, fncName })
  debuggerConsole("receive", `PubSubEs6 | ${uid} receive ${actionName} with ${fncName}`, action)
  return uid
}

const dispatch = (...args) => {
  let actionName = Array.prototype.slice.call(args).shift()
  let action = find(actionName)
  if (!action || action.subscriptions.length == 0){
    return debuggerConsole("not_found_subscriber", `PubSubEs6 | No't found subscriber to the action ${actionName}`, action)
  }
  action.subscriptions.forEach(message => {
    message.fnc.call(...args) //send all arguments expect the action name
  })
  debuggerConsole("dispatch", `PubSubEs6 | has been dispatch the action: #{actionName}`, {
    subscriptions: action.subscriptions,
    arguments: args.filter((item, index) => index != 0),
  })
  return true
}

const unsubscribe = (actionName, fnc_or_uid) => {
  if (!fnc_or_uid) return console.error("PubSubEs6 | Send a function or uid for unsubscribe")
  const key = typeof fnc_or_uid === 'string' ? 'uid' : 'fnc'
  var action = find(actionName)
  action.subscriptions = action.subscriptions.filter(message => message[key] !== fnc_or_uid)
  const key_name = key == "fnc" ? fnc_or_uid.name : fnc_or_uid
  debuggerConsole("unsubscribe", `PubSubEs6 | ${key_name} unsubscribe for ${actionName}`, action)
}

//Decorator
const on = function(actionType) {
  return function on(target, name, descriptor){
    var oldComponentDidMountFnc    = target.componentDidMount
    var oldComponentWillUnmountFnc = target.componentWillUnmount

    target.componentDidMount = function(){
      const uid = _generateUidReact({ target })
      if (!this.__uids__) this.__uids__ = []
      this.__uids__.push(uid)
      receive(actionType, this[name].bind(this), uid)
      if (oldComponentDidMountFnc) oldComponentDidMountFnc.bind(this)()
    }

    target.componentWillUnmount = function(){
      this.__uids__ && this.__uids__.map(uid => unsubscribe(actionType, uid))
      if(oldComponentWillUnmountFnc) oldComponentWillUnmountFnc.bind(this)()
    }

    return descriptor.value
  }
}

// private
var _genetageUid = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function _generateUidReact({ target }) {
  let componentName = target.constructor.name
  return `${_genetageUid()}-${componentName}`
}

//helpers

const find = (actionName) => ACTIONS.find(action => action.name == actionName)

const findSubscriptions = (actionName) => find(actionName).subscriptions

const findSubscriptionsFnc = (actionName) => findSubscriptions(actionName).map(message => message.fnc)

const destroyAllActions = () => ACTIONS = []

const actions = () => [...ACTIONS]

const status = function(){
  actions().map( function(action) {
    const subscriptionMessage = findSubscriptions(action.name).map( message => `${message.uid} -> ${message.fnc.name}` )
    console.log(`PubSubEs6 | All subscribers for the action (${action.name}) = `, `[ ${subscriptionMessage} ]`  )
  })
}

const statusForAction = function(action){
  const subscriptionMessage = findSubscriptions(action.name).map( message => `${message.uid} -> ${message.fnc.name}` )
  console.log(`PubSubEs6 | All subscribers for the Action (${action.name}) = `, `[ ${subscriptionMessage} ]`  )
}

const isDevelopmentMode = () => {
  if (typeof process != 'undefined'){
    return (process.env && process.env.NODE_ENV !== 'production')
  }
  return true
}

const config = {
  enableDebugger: isDevelopmentMode(),
  trace: {
    dispatch: false,
    receive: false,
    unsubscribe: false,
    not_found_subscriber: true,
  },
}

const debuggerConsole = function(type, message, data){
  if (config.enableDebugger) {
    if (config.trace.dispatch && type == "dispatch") {
      console.info(message, data)
    } else if (config.trace.receive && type == "receive") {
      console.info(message, data)
    } else if (config.trace.unsubscribe && type == "unsubscribe") {
      console.info(message, data)
    } else if (config.trace.not_found_subscriber && type == "not_found_subscriber") {
      console.warn(message, data)
    }
  }
}

//alias
const send             = dispatch
const publish          = dispatch
const broadcast        = dispatch
const addEventListener = receive
const PubSubEs6 = {dispatch, receive, on, unsubscribe, status,
  actions, find, findSubscriptions, findSubscriptionsFnc, config}
export {PubSubEs6, dispatch, receive, on, unsubscribe, status,
        actions, find, findSubscriptions, findSubscriptionsFnc, config}
