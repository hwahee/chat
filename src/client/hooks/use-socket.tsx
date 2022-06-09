import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { IChat, ISocketMessage, IUser } from '../../common/types'

const NetworkContext = createContext<{
  id: string
  chatData: IChat | null
  userData: { [key: string]: IUser }
  sendMessage(msg: ISocketMessage): void
  isReady: boolean
}>({
  // socket: new WebSocket('ws://127.0.0.1:3000'),
  id: '',
  chatData: null,
  userData: {},
  sendMessage: () => null,
  isReady: false,
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
          setUserData(msg.payload)
          break
        case 'chatDown':
          setChatData(msg.payload)
          break
      }
    }
  }, [socket])

  const isSocketReady = socket?.readyState === socket?.OPEN

  const value = useMemo(() => {
    return {
      id,
      chatData,
      userData,
      isReady: isSocketReady,
      sendMessage(msg: ISocketMessage) {
        if (!isSocketReady || !socket) {
          console.error('socket not ready')
          return
        }

        socket.send(JSON.stringify(msg))
      },
    }
  }, [id, chatData, userData, isSocketReady, socket])

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  )
}

const useSocket = () => {
  return useContext(NetworkContext)
}

export { NetworkProvider, useSocket }
