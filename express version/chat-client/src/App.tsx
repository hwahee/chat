import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ChatScreen } from './ChatScreen';
import { NetworkProvider } from './useSocket';

function App() {
  return (
    <div className="App">
      <NetworkProvider>
        <ChatScreen />
      </NetworkProvider>
    </div>
  );
}

export default App;
