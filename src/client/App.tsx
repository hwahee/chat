import React from 'react'
import './App.css'
import { ChatScreen } from './Components/chat-screen'
import { NetworkProvider } from './hooks/use-socket'

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
