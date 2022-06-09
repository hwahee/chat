import React, { useEffect, useRef, useState } from 'react'
import { useSocket } from '../../use-socket'
import { IChat } from '../../types'
import _ from 'lodash'

import './index.css'
/** 연결되어 있으면, 초록불, 연결이 안 됐으면 빨간불 */
const InternetStatusIndicator = () => {
  const { socket, id } = useSocket()
  const [connStatus, setConnStatus] = useState(false)

  useEffect(() => {
    console.log(socket, socket?.readyState, socket?.OPEN)
    if (socket && socket.readyState === socket.OPEN) {
      console.log('opened')
      setConnStatus(true)
    } else {
      console.log('closed')
      setConnStatus(false)
    }
  }, [socket, socket?.readyState])

  return (
    <span
      id='internet-status-indeicator'
      style={{ backgroundColor: connStatus ? 'green' : 'red' }}
    ></span>
  )
}
/** 채팅을 입력하는 부분
 * enter를 누르거나 send 버튼을 눌러서 보낼 수 있다
 */
const ChatInput = () => {
  const { socket } = useSocket()
  const inputInputRef = useRef<HTMLInputElement>(null!)
  const inputSendRef = useRef<HTMLInputElement>(null!)

  const send = () => {
    if (!(socket && socket.readyState === socket.OPEN)) {
      console.error('socket not ready')
      return
    }

    const chatDataToSend: IChat = {
      id: _.uniqueId(), //socket.id,
      msg: inputInputRef.current.value,
      timestamp: new Date().getTime(),
    }
    socket.send(JSON.stringify({ type: 'chat', payload: chatDataToSend }))
    inputInputRef.current.value = ''
  }
  const enterToSend = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && 0 < inputInputRef.current.value.length) {
      send()
    }
  }

  useEffect(() => {
    inputSendRef.current.addEventListener('click', send)
    inputInputRef.current.addEventListener('keydown', enterToSend)
    return () => {
      inputSendRef.current.removeEventListener('click', send)
      inputInputRef.current.removeEventListener('keydown', enterToSend)
    }
  }, [socket])

  return (
    <div className='chat-input-wrap'>
      <InternetStatusIndicator />
      <input ref={inputInputRef} id='chat-input' type='text' />
      <input
        ref={inputSendRef}
        id='chat-input-send'
        type='button'
        value='send'
      />
    </div>
  )
}

/** 개별 메세지로 내가 보낸 메세지는 오른쪽, 남이 보낸 메세지는 왼쪽으로 정렬된다 */
const Message = (props: { chatData: IChat; me: boolean }) => {
  const { chatData, me } = props
  return (
    <div className='message' style={{ textAlign: me ? 'right' : 'left' }}>
      {me ? (
        <div>{`${chatData.msg} <${chatData.id.slice(0, 3)}`}</div>
      ) : (
        <div>{`${chatData.id.slice(0, 3)}> ${chatData.msg} `}</div>
      )}
      <div style={{ fontSize: `0.5rem` }}>
        {new Date(chatData.timestamp).toTimeString().split(' ')[0]}
      </div>
    </div>
  )
}
/** 메세지 목록을 보여준다 */
const MessageWindow = () => {
  const [messages, setMessages] = useState<IChat[]>([])
  const { socket, id, chatData } = useSocket()

  //채팅 데이터가 업데이트될 때마다 메세지 목록에 추가한다
  useEffect(() => {
    if (!socket || !(socket.readyState === socket.OPEN)) return
    if (chatData) {
      setMessages(i => [...i, chatData])
    }
  }, [chatData])

  if (socket)
    return (
      <>
        <ul className='components message-window'>
          {messages.map(i => (
            <Message key={_.uniqueId('msgkey')} chatData={i} me={id === i.id} />
          ))}
        </ul>
      </>
    )
  else return <></>
}
const User = (props: { id: string; me?: boolean }) => {
  return (
    <div>
      {props.me && `(ME) `}
      {props.id}
    </div>
  )
}
/** 서버에서 유저 목록을 받아서 보여준다
 * 맨 처음에 접속한 자신을 보여주고, 그 다음부터 개별 유저를 보여준다
 */
const UserList = () => {
  const { socket, id, userData } = useSocket()

  if (socket)
    return (
      <>
        <ul className='components user-list'>
          <User key={_.uniqueId(`userkey`)} id={id} me />
          {Object.values(userData)
            .filter(i => i.id !== id)
            .map(i => (
              <User key={_.uniqueId(`userkey`)} id={i.id} />
            ))}
        </ul>
      </>
    )
  else return <></>
}

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
