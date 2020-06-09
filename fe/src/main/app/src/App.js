import React, { Component } from 'react'
import Chat from './components/chat'
import Sender from './components/sender'

class App extends Component {
  render() {
    return (
      <div>
        <Sender />
        <Chat />
      </div>
    )
  }
}

export default App
