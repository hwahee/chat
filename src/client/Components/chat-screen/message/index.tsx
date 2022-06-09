import React, { useEffect, useState } from 'react'
import { SYSTEM_ID } from '../../../../common/const'
import { IChat, IUser } from '../../../../common/types'
import { useSocket } from '../../../hooks/use-socket'

import './index.css'

/** 개별 메세지
 * 시스템이 보낸 메세지는 가운데, 내가 보낸 메세지는 오른쪽, 남이 보낸 메세지는 왼쪽으로 정렬된다 */
const Message = ({
  chatData,
  userData,
  isMe,
}: {
  chatData: IChat
  userData: IUser
  isMe: boolean
}) => {
  const isSystem = userData.id === SYSTEM_ID
  if (isSystem)
    return (
      <div className='message' style={{ textAlign: 'center' }}>
        {chatData.msg}
      </div>
    )
  else
    return (
      <div className='message' style={{ textAlign: isMe ? 'right' : 'left' }}>
        {isMe ? (
          <div>{`${chatData.msg} <${userData.nickname}`}</div>
        ) : (
          <div>{`${userData.nickname}> ${chatData.msg} `}</div>
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
  const { isReady, id, chatData, userData } = useSocket()

  //채팅 데이터가 업데이트될 때마다 메세지 목록에 추가한다
  useEffect(() => {
    if (!isReady) return
    if (chatData) {
      setMessages(i => [...i, chatData])
    }
  }, [chatData, isReady])

  if (isReady)
    return (
      <ul className='components message-window'>
        {messages.map(i => {
          const user = userData[i.userId]
          if (!user) return
          else
            return (
              <Message
                key={i.id}
                chatData={i}
                userData={user}
                isMe={id === i.userId}
              />
            )
        })}
      </ul>
    )
  else return null
}

export { MessageWindow }
