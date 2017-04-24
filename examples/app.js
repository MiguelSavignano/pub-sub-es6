import React from 'react'
import ReactDOM from 'react-dom'
import { autoSubscription, dispatch } from '../src/react-pub-sub'

class App extends React.Component {
  onHi(message){
    console.log(message)
  }
  render(){
    return (
      <h1>Hi react app</h1>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("react-root"))

dispatch("HI", "Miguel")