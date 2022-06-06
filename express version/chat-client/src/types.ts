interface IChat {
    id: string,
    msg: string,
    timestamp: number
}
interface IUser {
    id: string,
    nickname:string,
}

export type { IChat, IUser }