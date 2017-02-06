
# PubSub es6
Simple lib for subscribe and dispatch actions.

In our application we perform many more complex actions, and depending on our project structure sometimes it is difficult to handle all the events that happen.
We can simply think of giving a name to that complex action and send any data we need.

You can send your subscribers many arguments and of any kind; anyone who has subscribed to this event can execute an action

## React 
When you need to comunicate componentes maybe you find many difficulties.
You can resolve it sending a message to the other component.

```javascript
import {dispatch, receive, on}  from '../../lib/pub_sub_es6'

class ShoppingCard extends React.Component {
  state = { items: [] }
  @on("ADD_ITEM")
  onAddIem(item, anyCustomArguments){ 
    this.setState({ items: [item, ...this.state.items] })
  }
}

class Item extends React.Component {
  state = {selected: false}
  onClickHandler(item){
    dispatch("ADD_ITEM", this.props.item, this.props.anyProp)
    this.setState(selected: true)
  }
}
```
## dispatch
```javascript
  dispatch("USER.CLICK_IN_AD", adData)
```
## receive
```javascript
  receive("OPEN_SIGN_IN", (type) => type == 'modal' ? openModal() : redirectToSignIn() )
 ```
## on
```javascript
  @on("ACTION_NAME") function(data) { console.log("use decorators!!") }
```
## receive
```javascript
   var fnc = (data) => {}
  receive("MESSAGE", fnc, "uid-token" )
 ```
## unsubscribe
```javascript
  unsubscribe("MESSAGE", "uid-token") // anyone can unsubscibe 
 ```
## findSubscriptions
 ```javascript
   findSubscriptions("MESSAGE")
   // [ fnc, "uid-token" ]
 ```
## actions
 ```javascript
   actions()
   //[ { actionName, subscriptions: [ {fnc, uid} ] ]
```

