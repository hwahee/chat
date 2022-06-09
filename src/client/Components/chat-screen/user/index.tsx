import React from 'react'
import _ from 'lodash'
import { useSocket } from '../../../hooks/use-socket'

import './index.css'

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
          <User
            key={_.uniqueId(`userkey`)}
            id={userData[id]?.nickname ?? id}
            me
          />
          {Object.values(userData)
            .filter(i => i.id !== id)
            .map(i => (
              <User key={_.uniqueId(`userkey`)} id={i.nickname ?? i.id} />
            ))}
        </ul>
      </>
    )
  else return <></>
}

export { UserList }
