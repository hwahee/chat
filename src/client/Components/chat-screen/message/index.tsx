import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { IChat } from '../../../../common/types'
import { useSocket } from '../../../hooks/use-socket'

import './index.css'

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
  }, [chatData, socket])

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

export { MessageWindow }
