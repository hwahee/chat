interface IChat {
  id: string
  msg: string
  timestamp: number
}
interface IUser {
  id: string
  nickname?: string
}

type TSocketMessageType = 'userStatus' | 'chat'
interface ISocketMessage {
  type: TSocketMessageType
  payload: any
}

export type { IChat, IUser, TSocketMessageType, ISocketMessage }
