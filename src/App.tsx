import React from 'react'
import './App.css'
import { ChatScreen } from './Components/ChatScreen'
import { NetworkProvider } from './use-socket'

function App() {
  return (
    <div className='App'>
      <NetworkProvider>
        <ChatScreen />
      </NetworkProvider>
    </div>
  )
}

export default App
