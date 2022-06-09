import React, { useCallback, useEffect, useRef, useState } from 'react'
import { IChat } from '../../../../common/types'
import { useSocket } from '../../../hooks/use-socket'

import './index.css'

/** 연결되어 있으면, 초록불, 연결이 안 됐으면 빨간불 */
const InternetStatusIndicator = () => {
  const { socket } = useSocket()
  const [connStatus, setConnStatus] = useState(false)

  useEffect(() => {
    if (socket && socket.readyState === socket.OPEN) {
      setConnStatus(true)
    } else {
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
  const { socket, id } = useSocket()
  const inputInputRef = useRef<HTMLInputElement>(null!)
  const inputSendRef = useRef<HTMLInputElement>(null!)

  const send = useCallback(() => {
    if (!(socket && socket.readyState === socket.OPEN)) {
      console.error('socket not ready')
      return
    }

    const chatDataToSend: IChat = {
      id: id, //socket.id,
      msg: inputInputRef.current.value,
      timestamp: new Date().getTime(),
    }
    socket.send(JSON.stringify({ type: 'chat', payload: chatDataToSend }))
    inputInputRef.current.value = ''
  }, [id, socket])
  const enterToSend = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && 0 < inputInputRef.current.value.length) {
        send()
      }
    },
    [send],
  )

  useEffect(() => {
    inputSendRef.current.addEventListener('click', send)
    inputInputRef.current.addEventListener('keydown', enterToSend)
    return () => {
      inputSendRef.current.removeEventListener('click', send)
      inputInputRef.current.removeEventListener('keydown', enterToSend)
    }
  }, [enterToSend, send, socket])

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

export { ChatInput }
