
# PubSub es6
Simple lib for subscribe and dispatch actions.

In our application we perform many more complex actions, and depending on our project structure sometimes it is difficult to handle all the events that happen.
We can simply think of giving a name to that complex action and send any data we need.

You can send your subscribers many arguments and of any kind; anyone who has subscribed to this event can execute an action

## install
```sh
npm install pub-sub-es6 --save
```
## React
When you need to comunicate componentes maybe you find many difficulties.
You can resolve it sending a message to the other component.

The function onAddItem will be called when dispatched the action "ADD_ITEM".

```javascript
import {dispatch, receive, on}  from 'pub-sub-es6'
//ShoppingCart.jsx
class ShoppingCart extends React.Component {

  state = { items: [] }

  @on("ADD_ITEM")
  onAddIem(item, language){
    this.setState({ items: [item, ...this.state.items] })
  }

  render(){
    //....
  }

}

// Item.jsx
const Item = ({ item }) => (
  <div onClick={() => dispatch("ADD_ITEM", item)}></div>
)

```
### dispatch
```javascript
  dispatch("USER.CLICK_IN_AD", adData)
```
### receive
```javascript
  receive("OPEN_SIGN_IN", (type) => type == 'modal' ? openModal() : redirectToSignIn() )
```
### unsubscribe
```javascript
  var fnc = (data) => {}
  receive("ACTION", fnc, "custom-uid")
  unsubscribe("ACTION", "custom-uid")
  // or
  var fnc = () => {}
  const uid = receive("ACTION", fnc)
  unsubscribe("ACTION", uid)
```

## React comunication with plain javascript

```javascript
// ShoppingCart.jsx
class ShoppingCart extends React.Component {

  state = { items: [] }

  @on("ADD_ITEM")
  onAddIem(item, language){
    this.setState({ items: [item, ...this.state.items] })
  }

}
```
```html
// item.html
<li class="js-item-action-add" data-item='{"name":"My Item"}'>My Item</li>
```
```javascript
// my_controller.js
$(".js-item-action-add").on("click", function(event) {
  PubSubEs6.dispatch("ADD_ITEM", $(this).data("item"))
})
```

## Actions named
* The actions names it's a global name, it's recomended create a file with the actions names to avoid duplicate a action name.

```javascript
// site_actions.js
const actionsSite = {
  item:{
    add: "ADD_ITEM",
  }
}

import action from './site_actions'
dispatch(action.item.add, item, language)

```

## Devtools

Devtools it's a simple console logger for trace your actions.

### allActions
 ```javascript
   PubSubEs6.allActions()
   //[ { actionName, subscriptions: [ {fnc, uid} ] ]
```
### status
 ```javascript
   PubSubEs6.status()
   //All subscribers for the Action (ADD_ITEM) = `, `[ ShoppingCard -> onAddIem ]
```
### findSubscriptions
 ```javascript
   PubSubEs6.findSubscriptions("MESSAGE")
   // [ fnc, "uid-token" ]
 ```

### logger
If your module bundle set ```process.env.NODE_ENV == 'production'``` this logger will be off

The default options it's:
```javascript
  config = {
    trace: {
      dispatch: true,
      receive: false,
      unsubscribe: false,
      not_found_subscriber: true,
    },
  }
```

You can disable the logger for a specific action.
```javascript
import PubSubEs6 from 'pub-sub-es6'
PubSubEs6.config.trace.dispatch = { exept: ["MY_LOOP_ACTION"] }
```

## Decorator configuration

The decorator @on only works with react components

this decorator only subscribe in the componentDidMount and unsubscribe in the componentWillUnmount functions

to enable decorators see [decorators](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy)




