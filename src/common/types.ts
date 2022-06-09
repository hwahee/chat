interface IChat {
  id: string
  msg: string
  timestamp: number
}
interface IUser {
  id: string
  nickname?: string
}

// type TSocketMessageType = 'userStatus' | 'chat'

type ISocketMessage =
  | {
      type: 'userStatus'
      payload: {
        [key: string]: IUser
      }
    }
  | {
      type: 'chat'
      payload: IChat
    }

export type { IChat, IUser, ISocketMessage }
