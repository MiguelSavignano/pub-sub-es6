
// actions = [
//   {
//     name,
//     subscriptions: [ message ]
//   }
// ]
// message { fnc, uid, fncName }

const isDevelopmentMode = () => {
  if (typeof process != 'undefined'){
    return (process.env && process.env.NODE_ENV !== 'production')
  }
  return true
}
class PubSubEs6 {

  constructor(){
    this.actions = []
  }

  receive = (actionName, fnc, uid) => {
    var uid = uid || this._genetageUid()
    var action = this.find(actionName)
    if(!action){
      action = { name: actionName, subscriptions: [] }
      this.actions.push(action)
    }
    const fncName = fnc.name
    action.subscriptions.push({ fnc, uid, fncName })
    this.debuggerConsole("receive", `PubSubEs6 | ${uid} receive ${actionName} with ${fncName}`, action)
    return uid
  }

  dispatch = (...args) => {
    let actionName = Array.prototype.slice.call(args).shift()
    let action = this.find(actionName)
    if (!action || action.subscriptions.length == 0){
      return this.debuggerConsole("not_found_subscriber", `PubSubEs6 | No't found subscriber to the action ${actionName}`, { name: actionName })
    }
    action.subscriptions.forEach(message => {
      message.fnc.call(...args) //send all arguments except the action name
    })
    this.debuggerConsole("dispatch", `PubSubEs6 | has been dispatch the action: #{actionName}`, {
      ...action,
      arguments: args.filter((item, index) => index != 0),
    })
    return true
  }

  unsubscribe = (actionName, fnc_or_uid) => {
    if (!fnc_or_uid) return console.error("PubSubEs6 | Send a function or uid for unsubscribe")
    const key = typeof fnc_or_uid === 'string' ? 'uid' : 'fnc'
    var action = this.find(actionName)
    action.subscriptions = action.subscriptions.filter(message => message[key] !== fnc_or_uid)
    const key_name = key == "fnc" ? fnc_or_uid.name : fnc_or_uid
    this.debuggerConsole("unsubscribe", `PubSubEs6 | ${key_name} unsubscribe for ${actionName}`, action)
  }

  // Decorator
  on = (actionType) => {
    const _generateUidReact = this._generateUidReact
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
  _genetageUid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  _generateUidReact = ({ target }) => {
    let componentName = target.constructor.name
    return `${this._genetageUid()}-${componentName}`
  }

  //helpers

  find = (actionName) => this.actions.find(action => action.name == actionName)

  findSubscriptions = (actionName) => this.find(actionName).subscriptions

  destroyAllActions = () => this.actions = []

  actions = () => [...this.actions]

  // devtools

  config = {
    enableDebugger: isDevelopmentMode(),
    trace: {
      dispatch: true,
      receive: false,
      unsubscribe: false,
      not_found_subscriber: true,
    },
  }

  debuggerConsole = function(type, message, data) {
    // debugger;
    if (this.config.enableDebugger) {
      if (this.needTrace(type, message, data) && type == "not_found_subscriber") {
        console.warn(message, data)
      } else if (this.needTrace(type, message, data)) {
        console.info(message, data)
      }
    }
  }

  needTrace = (type, message, data) => {
    if (!this.config.trace[type]) { return false }
    if (typeof this.config.trace[type] != "boolean") {
      const actions_exepts = this.config.trace[type].exept
      const actionName = data.name
      return actions_exepts.includes(actionName) ? false : true
    }
    return true
  }

  status = () => {
    this.actions().map( function(action) {
      const subscriptionMessage = this.findSubscriptions(action.name).map( message => `${message.uid} -> ${message.fnc.name}` )
      console.log(`PubSubEs6 | All subscribers for the action (${action.name}) = `, `[ ${subscriptionMessage} ]`  )
    })
  }

  statusForAction = function(action){
    const subscriptionMessage = this.findSubscriptions(action.name).map( message => `${message.uid} -> ${message.fnc.name}` )
    console.log(`PubSubEs6 | All subscribers for the Action (${action.name}) = `, `[ ${subscriptionMessage} ]`  )
  }

}

const pubSubEs6 = new PubSubEs6()
export default pubSubEs6
const { on, dispatch, unsubscribe, receive, config,
  status, findSubscriptions } = pubSubEs6
export { on, dispatch, unsubscribe, receive, config,
  status, findSubscriptions }

