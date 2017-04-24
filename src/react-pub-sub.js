
// actions = [
//   {
//     name,
//     subscriptions: [ message ]
//   }
// ]
// message { fnc, uid, fncName }


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


class ReactPubSub {

  constructor() {
    this.ACTIONS = []
    this.config = {
      enableDebugger: false,
      trace: false,
    }
  }

  find = (actionName) => this.ACTIONS.find(action => action.name == actionName)

  receive = (actionName, fnc, uid) => {
    var uid = uid || _genetageUid()
    var action = this.find(actionName)
    if (!action) {
      action = {name: actionName, subscriptions: []}
      this.ACTIONS.push(action)
    }
    action.subscriptions.push({ fnc, uid, fncName: fnc.name })
    this.debuggerConsole(`${uid} receive ${actionName} with`, fnc.name)
    return uid
  }

  dispatch = (...args) => {
    let actionName = Array.prototype.slice.call(args).shift()
    let action = this.find(actionName)
    if (!action || action.subscriptions.length == 0) return console.warn(`No't found subscriber to the Action ${actionName}`)
    action.subscriptions.forEach(message => {
      message.fnc.call(...args) //send all arguments expect the action name
    })
    this.debuggerConsole("dispatch", {
      actionName,
      subscriptions: action.subscriptions,
      message: args.filter((item, index) => index != 0),
    })
  }

  unsubscribe = (actionName, fnc_or_uid) => {
    if (!fnc_or_uid) return console.error("send a function or uid for unsubscribe")
    const key = typeof fnc_or_uid === 'string' ? 'uid' : 'fnc'
    var action = this.find(actionName)
    action.subscriptions = action.subscriptions.filter(message => message[key] !== fnc_or_uid)
    this.debuggerConsole(`${fnc_or_uid} unsubscribe for ${actionName}`)
  }

  // Decorator
  autoSubscription = (actionType) => {
    const self = this
    return function on(target, name, descriptor){
      var oldComponentDidMountFnc    = target.componentDidMount
      var oldComponentWillUnmountFnc = target.componentWillUnmount 

      target.componentDidMount = function(){
        const uid = _generateUidReact({ target })
        if (!this.__uids__) this.__uids__ = []
        this.__uids__.push(uid)
        slef.receive(actionType, this[name].bind(this), uid)
        if (oldComponentDidMountFnc) oldComponentDidMountFnc.bind(this)()
      }

      target.componentWillUnmount = function(){
        this.__uids__ && this.__uids__.map(uid => self.unsubscribe(actionType, uid))
        if(oldComponentWillUnmountFnc) oldComponentWillUnmountFnc.bind(this)()
      }

      return descriptor.value
    }
  }

  status = () => {
    this.actions().map( function(action) {
      const subscriptionMessage = findSubscriptions(action.name).map( message => `${message.uid} -> ${message.fnc.name}` )
      console.log(`All subscribers for the Action (${action.name}) = `, `[ ${subscriptionMessage} ]`  )
    })
  }

  debuggerConsole = () => { 
    if (this.config.enableDebugger) {
      if (arguments[0] == "dispatch") {
        console.info(...arguments)
      } else if (this.config.trace) {
        console.info(...arguments)
      }
    }
  }

}

export default new ReactPubSub


