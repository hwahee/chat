import Koa from 'koa'
import websocketify from 'koa-websocket'
import serve from 'koa-static'
import path from 'path'
import { WebSocket as WS } from 'ws'
import { ISocketMessage, IUser } from '../common/types'

const app = websocketify(new Koa())
app.use(serve(path.join(__dirname, '../../build')))

class Clients {
  private _list: { [key: string]: WS } = {}
  public enlist(id: string, socket: WS) {
    this._list[id] = socket
  }
  public delist(id: string) {
    delete this._list[id]
  }
  public broadcast(msg: ISocketMessage) {
    const serializedMsg = JSON.stringify(msg)
    Object.values(this._list).forEach(client => {
      client.send(serializedMsg)
    })
  }

  get userStatus() {
    const userList: { [key: string]: IUser } = {}
    Object.keys(this._list).forEach(i => {
      userList[i] = { id: i, nickname: i.slice(0, 3) }
    })
    return userList
  }
}
const clients = new Clients()

app.ws.use(ctx => {
  clients.enlist(ctx.querystring, ctx.websocket)
  console.log(ctx.querystring, clients.userStatus)
  clients.broadcast({
    type: 'userStatus',
    payload: clients.userStatus,
  })

  /**chatting functions */
  ctx.websocket.onmessage = e => {
    const msg: ISocketMessage = JSON.parse(e.data.toString())
    console.log('incoming message: ', msg)
    switch (msg.type) {
      case 'userStatus': {
        break
      }
      case 'chat': {
        const msgToSend = {
          type: 'chat',
          payload: msg.payload,
        } as const
        clients.broadcast(msgToSend)
        break
      }
    }
  }
})

const WEB_PORT = 3000
app.listen(WEB_PORT, () => {
  console.log(`Server listening on port: ${WEB_PORT}`)
})

/**
 * 코멘트
 * - 타입 WebSocket을 사용하려 했는데 충돌이 있었다
 *   - 그래서 Type Definition을 따라가서 읽어보니 @types/ws에 정의돈 것과 다른 곳에 정의된 것 두 가지가 잇었다
 *   > ws에 정의된 것을 임포트한 다음 이름을 바꿔서(안 바꾸면 안됨) 사용하였다
 */
