import Koa from 'koa'
import websocketify from 'koa-websocket'
import serve from 'koa-static'
import path from 'path'
import { ISocketMessage } from './types'

// const userList: { [key: string]: IUser } = {}

const app = websocketify(new Koa())
app.use(serve(path.join(__dirname, '../build')))

const clients = []
app.ws.use(ctx => {
  console.log(`Logged in from: ${ctx.websocket}`)
  clients.push(ctx.websocket)

  ctx.websocket.send(
    JSON.stringify({
      type: 'userStatus',
      payload: '21342134',
    } as ISocketMessage),
  )
  // // userList[ctx.websocket.id] = { id: ctx.websocket.id }
  // ctx.websocket.send(
  //   JSON.stringify({ type: 'userStatus', payload: userList } as ISocketMessage),
  // )

  // ctx.websocket.on('disconnect', () => {
  //   console.log(`Logged out from: ${ctx.websocket}`)
  //   // delete userList[ctx.websocket.id]
  //   ctx.websocket.emit('userStatus', userList)
  // })

  /**chatting functions */
  ctx.websocket.onmessage = e => {
    const msg: ISocketMessage = JSON.parse(e.data.toString())
    console.log('incoming message: ', msg)
    switch (msg.type) {
      case 'userStatus':
        break
      case 'chat':
        ctx.websocket.send(
          JSON.stringify({
            type: 'userStatus',
            payload: '21342134',
          } as ISocketMessage),
        )
    }
  }
})

const WEB_PORT = 3000
app.listen(WEB_PORT, () => {
  console.log(`Server listening on port: ${WEB_PORT}`)
})

// app.use(serve(path.join(__dirname, '../build')))

// const wsRouter = new Router()
// app.use(wsRouter.routes()).use(wsRouter.allowedMethods())

// wsRouter.get('/', async (ctx, next) => {
//   console.log(`Logged in from: ${ctx.websocket.id}`)

//   userList[ctx.websocket.id] = { id: ctx.websocket.id }
//   const msg: ISocketMessage = { type: 'userStatus', payload: userList }
//   ctx.websocket.send(JSON.stringify(msg))

//   ctx.websocket.on('disconnect', () => {
//     console.log(`Logged out from: ${ctx.websocket.id}`)
//     delete userList[ctx.websocket.id]
//     ctx.websocket.emit('userStatus', userList)
//   })

//   /**chatting functions */
//   ctx.websocket.on('chat', (data: IChat) => {
//     console.log(data.id, ': ', data.msg)

//     ctx.websocket.emit('chat', data)
//   })

//   return next
// })

// const WEB_PORT = 3000
// app.listen(WEB_PORT, () => {
//   console.log(`Server listening on port: ${WEB_PORT}`)
// })
