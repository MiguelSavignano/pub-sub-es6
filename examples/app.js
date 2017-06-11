import React from 'react'
import ReactDOM from 'react-dom'
import { on, dispatch, config } from '../src/pub-sub-es6'

config.trace.dispatch = {exept: ["HI"]}
config.trace.not_found_subscriber = {exept: ["SOME_OTHER"]}

class App extends React.Component {
  @on("HI")
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

dispatch("HI", "Miguel2")
dispatch("SOME_OTHER", "Miguel")