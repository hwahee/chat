import React from 'react'
import { ChatInput } from './chat-input'
import { MessageWindow } from './message'
import { UserList } from './user'

import './index.css'
/** 채팅에 사용되는 화면 전체 */
const ChatScreen = () => {
  return (
    <>
      <div className='chat-screen'>
        <div className='msg-user-wrapper'>
          <MessageWindow />
          <UserList />
        </div>
        <ChatInput />
      </div>
    </>
  )
}

export { ChatScreen }
