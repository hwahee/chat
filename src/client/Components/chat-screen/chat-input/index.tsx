import React, { useCallback, useState } from 'react'
import { IChat } from '../../../../common/types'
import { useSocket } from '../../../hooks/use-socket'

import './index.css'

/** 연결되어 있으면, 초록불, 연결이 안 됐으면 빨간불 */
const InternetStatusIndicator = () => {
  const { isReady } = useSocket()
  return (
    <span
      className='internet-status-indeicator'
      style={{ backgroundColor: isReady ? 'green' : 'red' }}
    />
  )
}
/** 채팅을 입력하는 부분
 * enter를 누르거나 send 버튼을 눌러서 보낼 수 있다
 */
const ChatInput = () => {
  const [chatInput, setChatInput] = useState('')
  const { sendMessage, id: myId } = useSocket()

  const send = useCallback(() => {
    sendMessage({ type: 'chatUp', payload: { msg: chatInput } })
    setChatInput('')
  }, [chatInput, sendMessage])

  const enterToSend = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey && 0 < chatInput.length) {
        send()
      }
    },
    [chatInput.length, send],
  )

  return (
    <div className='chat-input-wrap'>
      <InternetStatusIndicator />
      <input
        className='chat-input'
        type='text'
        value={chatInput}
        onChange={e => {
          setChatInput(e.currentTarget.value)
        }}
        onKeyDown={enterToSend}
      />
      <input
        className='chat-input-send'
        type='button'
        value='send'
        onClick={send}
      />
    </div>
  )
}

export { ChatInput }
