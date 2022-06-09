import Koa from 'koa'
import websocketify from 'koa-websocket'
import serve from 'koa-static'
import path from 'path'
import { WebSocket as WS } from 'ws'
import { ISocketMessage, IUser } from '../common/types'
import { SYSTEM_ID } from '../common/const'

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
  public broadcast(msg: ISocketMessage, excludedId: string[] = []) {
    const serializedMsg = JSON.stringify(msg)

    Object.entries(this._list)
      .filter(i => !excludedId.includes(i[0]))
      .map(i => i[1])
      .forEach(client => {
        client.send(serializedMsg)
      })
  }

  get userStatus() {
    const userList: { [key: string]: IUser } = {}
    userList[SYSTEM_ID] = { id: SYSTEM_ID, nickname: 'sys' }
    Object.keys(this._list).forEach(i => {
      userList[i] = { id: i, nickname: i.slice(0, 3) }
    })
    return userList
  }
}
const clients = new Clients()

let latestChatUUID = 0

app.ws.use(ctx => {
  clients.enlist(ctx.querystring, ctx.websocket)
  clients.broadcast({
    type: 'userStatus',
    payload: clients.userStatus,
  })
  clients.broadcast(
    {
      type: 'chatDown',
      payload: {
        msg: `${ctx.querystring} entered`,
        id: latestChatUUID++,
        userId: SYSTEM_ID,
        timestamp: new Date().getTime(),
      },
    },
    [ctx.querystring],
  )
  ctx.websocket.send(
    JSON.stringify({
      type: 'chatDown',
      payload: {
        msg: `You entered`,
        id: latestChatUUID++,
        userId: SYSTEM_ID,
        timestamp: new Date().getTime(),
      },
    }),
  )

  ctx.websocket.on('close', () => {
    clients.delist(ctx.querystring)
    clients.broadcast({
      type: 'userStatus',
      payload: clients.userStatus,
    })
    clients.broadcast(
      {
        type: 'chatDown',
        payload: {
          msg: `${ctx.querystring} leaved`,
          id: latestChatUUID++,
          userId: 'system',
          timestamp: new Date().getTime(),
        },
      },
      [ctx.querystring],
    )
  })

  /**chatting functions */
  ctx.websocket.onmessage = e => {
    const msg: ISocketMessage = JSON.parse(e.data.toString())
    console.log('incoming message: ', msg)
    switch (msg.type) {
      case 'userStatus': {
        break
      }
      case 'chatUp': {
        clients.broadcast({
          type: 'chatDown',
          payload: {
            ...msg.payload,
            id: latestChatUUID++,
            userId: ctx.querystring,
            timestamp: new Date().getTime(),
          },
        })
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
