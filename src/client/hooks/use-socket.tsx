import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { IChat, ISocketMessage, IUser } from '../../common/types'

const NetworkContext = createContext<{
  socket?: WebSocket
  id: string
  chatData: IChat | null
  userData: { [key: string]: IUser }
}>({
  // socket: new WebSocket('ws://127.0.0.1:3000'),
  id: '',
  chatData: null,
  userData: {},
})
const NetworkProvider = ({ children }: { children: React.ReactNode }) => {
  const [id] = useState(crypto.randomUUID())
  const [socket, setSocket] = useState<WebSocket>()
  const [chatData, setChatData] = useState<IChat | null>(null)
  const [userData, setUserData] = useState<{ [key: string]: IUser }>({})

  useEffect(() => {
    setSocket(new WebSocket(`ws://127.0.0.1:3000?${id}`))
  }, [id])

  useEffect(() => {
    if (!socket) return

    socket.onmessage = (e: MessageEvent) => {
      const msg: ISocketMessage = JSON.parse(e.data)

      switch (msg.type) {
        case 'userStatus':
          setUserData(msg.payload as { [key: string]: IUser })
          break
        case 'chat':
          setChatData(msg.payload as IChat)
          break
      }
    }
  }, [socket])

  const value = useMemo(() => {
    return {
      socket,
      id,
      chatData,
      userData,
    }
  }, [socket, id, chatData, userData])

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  )
}

const useSocket = () => {
  const { socket, id, chatData, userData } = useContext(NetworkContext)
  return { socket, id, chatData, userData }
}

export { NetworkProvider, useSocket }
