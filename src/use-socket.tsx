import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { IChat, ISocketMessage, IUser } from './types'

declare global {
  interface Window {
    chat: (msg: string) => void
  }
}
interface ISocketData {
  timestamp: number
  payload: any
}

const NetworkContext = createContext<{
  socket: WebSocket
  id: string
  chatData: IChat | null
  userData: { [key: string]: IUser }
}>({
  socket: new WebSocket('ws://127.0.0.1:3000'),
  id: '',
  chatData: null,
  userData: {},
})
const NetworkProvider = ({ children }: { children: any }) => {
  const [id] = useState(crypto.randomUUID())
  const [socket, setSocket] = useState<WebSocket>(null!)
  const [chatData, setChatData] = useState<IChat | null>(null)
  const [userData, setUserData] = useState<{ [key: string]: IUser }>({})

  useEffect(() => {
    setSocket(new WebSocket('ws://127.0.0.1:3000'))
  }, [])

  useEffect(() => {
    if (!socket) return

    socket.onmessage = (e: MessageEvent) => {
      console.log('incoming message: ', e.data)
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

  return (
    <NetworkContext.Provider
      value={{ socket, id, chatData, userData }}
      children={children}
    />
  )
}

const useSocket = () => {
  const { socket, id, chatData, userData } = useContext(NetworkContext)
  return { socket, id, chatData, userData }
}

export { NetworkProvider, useSocket }
