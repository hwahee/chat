import { useCallback, useEffect, useRef, useState } from "react"
import { useSocket } from "../useSocket"
import { IChat, IUser } from "../types"
import _ from 'lodash'

import './ChatScreen.css'
const InternetStatusIndicator = () => {
    const { socket } = useSocket()
    const [connStatus, setConnStatus] = useState(false)

    useEffect(() => {
        console.log(socket)
        if (socket?.connected) setConnStatus(true)
        else setConnStatus(false)
    }, [socket, socket?.connected])

    return (
        <span id='internet-status-indeicator' style={{ backgroundColor: (connStatus) ? 'green' : 'red' }}>
        </span>
    )
}
const ChatInput = () => {
    const { socket } = useSocket()
    const inputInputRef = useRef<HTMLInputElement>(null!)
    const inputSendRef = useRef<HTMLInputElement>(null!)

    const send = () => {
        console.log(socket)
        const chatDataToSend: IChat = { id: socket.id, msg: inputInputRef.current.value, timestamp: new Date().getTime() }
        socket.emit('chat', chatDataToSend)
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
        <div className='chat-input-wrap' >
            <InternetStatusIndicator />
            <input ref={inputInputRef} id='chat-input' type='text' />
            <input ref={inputSendRef} id='chat-input-send' type='button' value='send' />
        </div>
    )
}
const Message = (props: { chatData:IChat, me: boolean }) => {
    const {chatData, me}=props
    return <div className='message' style={{ textAlign: (me ? 'right' : 'left') }}>
        {me ?
            <div>{`${chatData.msg} <${chatData.id.slice(0, 3)}`}</div>
            :
            <div>{`${chatData.id.slice(0, 3)}> ${chatData.msg} `}</div>
        }
        <div style={{ fontSize: `0.5rem` }}>{new Date(chatData.timestamp).toTimeString().split(' ')[0]}</div>
    </div>
}
const MessageWindow = () => {
    const [messages, setMessages] = useState<IChat[]>([])
    const { socket, chatData } = useSocket()

    //채팅 데이터가 업데이트될 때마다 메세지 목록에 추가한다
    useEffect(() => {
        if (!socket || !socket.active) return
        if (chatData) {
            setMessages(i => ([...i, chatData]))
        }
    }, [chatData])

    if (socket) return <>
        <ul className='components message-window'>
            {messages.map(i => <Message key={_.uniqueId('msgkey')} chatData={i} me={socket.id === i.id} />)}
        </ul>
    </>
    else return <></>
}
const User = (props: { id: string, me?: boolean }) => {
    return <div>
        {props.me && `(ME) `}{props.id}
    </div>
}
const UserList = () => {
    const { socket, userData } = useSocket()

    if (socket) return <>
        <ul className='components user-list'>
            <User key={_.uniqueId(`userkey`)} id={socket.id} me />
            {Object.values(userData).filter(i => i.id !== socket.id).map(i => <User key={_.uniqueId(`userkey`)} id={i.id} />)}
        </ul>
    </>
    else return <></>
}
const ChatScreen = () => {
    return <>
        <div className='chat-screen'>
            <div className='msg-user-wrapper'  >
                <MessageWindow />
                <UserList />
            </div>
            <ChatInput />
        </div>
    </>
}


export { ChatScreen }