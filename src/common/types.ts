interface IChat {
  id: number
  msg: string
  userId: string
  timestamp: number
}
interface IUser {
  id: string
  nickname?: string
}

type ISocketMessage =
  | {
      type: 'userStatus'
      payload: {
        [key: string]: IUser
      }
    }
  | {
      type: 'chatUp'
      payload: Pick<IChat, 'msg'>
    }
  | {
      type: 'chatDown'
      payload: IChat
    }

export type { IChat, IUser, ISocketMessage }
