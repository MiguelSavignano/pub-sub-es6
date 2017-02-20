
// actions = [
//   {
//     name,
//     subscriptions: [ message ]
//   }
// ]
// message { fnc, uid, fncName }
var ACTIONS = []
const find                 = (actionName) => ACTIONS.find( action => action.name == actionName)
const findSubscriptions    = (actionName) => find(actionName).subscriptions
const findSubscriptionsFnc = (actionName) => findSubscriptions(actionName).map(message => message.fnc)
const dispatch = (...args) => {
  let actionName = Array.prototype.slice.call(args).shift()
  let action = find(actionName)
  if (!action) return console.warn(`No't found subscriber to the Action ${actionName}`)
  action.subscriptions.forEach(message => {
    message.fnc.call(...args) //send all arguments expect the action name
  })
  debuggerConsole("dispatch", {
    actionName,
    subscriptions: action.subscriptions,
    message: args.filter( (item, index) => index != 0 ),
  })
}
const receive = (actionName, fnc, uid) => {
  var action = find(actionName)
  if(!action){ 
    action = {name: actionName, subscriptions: []}
    ACTIONS.push(action)
  }
  const fncName = fnc.name
  action.subscriptions.push({ fnc, uid, fncName })
  debuggerConsole(`${uid} receive ${actionName} with`, fnc.name)
}
const unsubscribe = (actionName, fnc_or_uid) => {
  if(!fnc_or_uid) return console.error("send a function or uid for unsubscribe")
  const key = typeof fnc_or_uid === 'string' ? 'uid' : 'fnc'
  var action = find(actionName)
  action.subscriptions = action.subscriptions.filter(message => message[key] !== fnc_or_uid)
}
const destroyAllActions = () => ACTIONS = []
const actions = () => [...ACTIONS]
//Decorator
const on = function(actionType, options={}) {
  return function on(target, name, descriptor){
    var oldComponentDidMountFnc = target.componentDidMount
    Object.defineProperty(target.constructor.prototype, "componentDidMount", {
        value: function() {
          const scopeValue = _callChainMethods(this, options.scope)
          const actionName = _generateActionNameReact({actionType, scopeValue})
          const uid        = _generateUidReact({target, scopeValue, reactInstance: this})
          receive(actionName, this[name].bind(this), uid)
          if(oldComponentDidMountFnc) oldComponentDidMountFnc.bind(this)()
        },
        configurable: true,
      })
   var oldComponentWillUnmountFnc = target.componentWillUnmount
   Object.defineProperty(target.constructor.prototype, "componentWillUnmount", {
        value: function() {
          const scopeValue = _callChainMethods(this, options.scope)
          const actionName = _generateActionNameReact({actionType, scopeValue})
          const uid        = _generateUidReact({target, scopeValue, reactInstance: this})
          unsubscribe(actionName, uid)
          if(oldComponentWillUnmountFnc) oldComponentWillUnmountFnc.bind(this)()
        },
        configurable: true,
      })
    return descriptor.value
  }
}
const status = function(){
  actions().map( function(action) {
    const subscriptionMessage = findSubscriptions(action.name).map( message => `${message.uid} -> ${message.fnc.name}` )
    console.log(`All subscribers for the Action (${action.name}) = `, `[ ${subscriptionMessage} ]`  )
  })
}

const config = {
  enableDebugger: false,
  trace: false,
}
const debuggerConsole = function(){ config.enableDebugger && console.info(...arguments) }

function _generateUidReact({target, reactInstance, scopeValue}){
  let reactUid = reactInstance._reactInternalInstance._debugID
  let componentName = target.constructor.name
  return scopeValue ? `${reactUid}-${componentName}|${scopeValue}` : `${reactUid}-${componentName}`
}

function _generateActionNameReact({actionType, scopeValue}){
  return scopeValue ? `${actionType}|${scopeValue}` : `${actionType}`
}

function _callChainMethods(object, string_chanin){
  if(!string_chanin){ return undefined }
  var memo = object
  string_chanin.split(".").forEach( key => (memo = memo[key]) )
  return memo
}


//alias
const send             = dispatch
const publish          = dispatch
const broadcast        = dispatch
const addEventListener = receive
const PubSubEs6 = {dispatch, receive, on, unsubscribe, status,
  actions, find, findSubscriptions, findSubscriptionsFnc, config}
export {dispatch, receive, on, unsubscribe, status,
        actions, find, findSubscriptions, findSubscriptionsFnc, PubSubEs6, config}