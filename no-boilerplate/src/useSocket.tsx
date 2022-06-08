import { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client';
import { IChat, IUser } from './types';

declare global {
    interface Window {
        chat: (msg: string) => void
    }
}
interface ISocketData {
    timestamp: number,
    payload: any
}

const NetworkContext = createContext<{ socket: Socket, chatData: IChat | null, userData: { [key: string]: IUser } }>({ socket: io(''), chatData: null, userData: {} });
const NetworkProvider = ({ children }: { children: any }) => {
    const [socket, setSocket] = useState<Socket>(null!)
    const [socketConnected, setSocketConnected] = useState(false)
    const [chatData, setChatData] = useState<IChat | null>(null)
    const [userData, setUserData] = useState<{ [key: string]: IUser }>({})

    useEffect(() => {
        setSocket(io(`localhost:2002`))
    }, [])

    useEffect(() => {
        if (!socket) return;

        socket.on('connect', () => {
            setSocketConnected(socket.connected);
        });
        socket.on('disconnect', () => {
            setSocketConnected(socket.connected);
        });

        socket.on('userStatus', (data: { [key: string]: IUser }) => {``
            setUserData(data)
        })
        socket.on('chat', (data: IChat) => {
            setChatData(data)
        })
    }, [socket]);

    return <NetworkContext.Provider value={{ socket, chatData, userData }} children={children} />
}

const useSocket = () => {
    const { socket, chatData, userData } = useContext(NetworkContext)
    return { socket, chatData, userData }
}

export { NetworkProvider, useSocket }

