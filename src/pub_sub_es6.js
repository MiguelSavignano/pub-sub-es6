
// actions = [
//   {
//     name,
//     subscriptions: [ message ]
//   }
// ]
// message { fnc, uid, fncName }
var ACTIONS = []
var genetageUid = function(){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });
}

const find                 = (actionName) => ACTIONS.find( action => action.name == actionName)
const findSubscriptions    = (actionName) => find(actionName).subscriptions
const findSubscriptionsFnc = (actionName) => findSubscriptions(actionName).map(message => message.fnc)
const dispatch = (...args) => {
  let actionName = Array.prototype.slice.call(args).shift()
  let action = find(actionName)
  if (!action || action.subscriptions.length == 0) return console.warn(`No't found subscriber to the Action ${actionName}`)
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
    target.componentDidMount = function(){
      const scopeValue = _callChainMethods(this, options.scope)
      const actionName = _generateActionNameReact({actionType, scopeValue})
      const uid        = _generateUidReact({target, scopeValue })
      this._pub_sub_es6_internal_uids = this._pub_sub_es6_internal_uids || []
      this._pub_sub_es6_internal_uids.push(uid)
      receive(actionName, this[name].bind(this), uid)
      if(oldComponentDidMountFnc) oldComponentDidMountFnc.bind(this)()
    }
    var oldComponentWillUnmountFnc = target.componentWillUnmount
    target.componentWillUnmount = function(){
      const scopeValue = _callChainMethods(this, options.scope)
      const actionName = _generateActionNameReact({actionType, scopeValue})
      this._pub_sub_es6_internal_uids && this._pub_sub_es6_internal_uids.forEach( (uid) => {
        unsubscribe(actionName, uid)
      })
      this._pub_sub_es6_internal_uids = []
      if(oldComponentWillUnmountFnc) oldComponentWillUnmountFnc.bind(this)()
    }
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

function _generateUidReact({target, scopeValue}){
  let reactUid      = genetageUid()
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
