
# PubSub es6
Simple lib for subscribe and dispatch actions.

In our application we perform many more complex actions, and depending on our project structure sometimes it is difficult to handle all the events that happen.
We can simply think of giving a name to that complex action and send any data we need.

You can send your subscribers many arguments and of any kind; anyone who has subscribed to this event can execute an action

## install
```sh
npm install 'pub-sub-es6' --save
```
## React 
When you need to comunicate componentes maybe you find many difficulties.
You can resolve it sending a message to the other component.

The function onAddItem will be called when dispatched the action "ADD_ITEM".

```javascript
import {dispatch, receive, on}  from 'pub-sub-es6'

class ShoppingCard extends React.Component {

  state = { items: [] }

  @on("ADD_ITEM")
  onAddIem(item, language){ 
    this.setState({ items: [item, ...this.state.items] })
  }

}

class Item extends React.Component {

  onClickHandler(item){
    const {item, language} = this.props
    dispatch("ADD_ITEM", item, language)
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
## unsubscribe
```javascript
  var fnc = (data) => {}
  receive("MESSAGE", fnc, "uid-token")
  unsubscribe("MESSAGE", "uid-token") // anyone can unsubscribe
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

## React comunucation with plain javascript

1. Export PubSubEs6 Global example in webpack entry file
```javascript
import { PubSubEs6 } from 'pub-sub-es6'
global.PubSubEs6 = PubSubEs6
```

```javascript
//shopping_card.jsx
class ShoppingCard extends React.Component {

  state = { items: [] }

  @on("ADD_ITEM")
  onAddIem(item, language){ 
    this.setState({ items: [item, ...this.state.items] })
  }

}
```

```javascript
//my_controller.js
$(".item-action-add").on("click", function(event){
  PubSubEs6.dispatch("ADD_ITEM", $(this).data("item"))
})
```


