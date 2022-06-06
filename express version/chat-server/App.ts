import express from "express";
import cors from "cors";
import http from 'http'
import path from "path";
import fs from "fs"
import { Server } from 'socket.io'

interface IChat {
    id: string,
    msg: string,
    timestamp: number
}
interface IUser {
    id: string
}

const app = express();
const PORT = 2002;
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST']
    }
})

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const userList: { [key: string]: IUser } = {}
io.on('connection', (socket) => {
    console.log(`Logged in from: ${socket.id}`)
    userList[socket.id] = { id: socket.id }
    io.emit('userStatus', userList)

    socket.on('disconnect', () => {
        console.log(`Logged out from: ${socket.id}`)
        delete userList[socket.id]
        io.emit('userStatus', userList)
    })

    /**chatting functions */
    socket.on('chat', (data: IChat) => {
        console.log(data.id, ': ', data.msg)

        io.emit('chat',data)
    })
})

server.listen(PORT, () => {
    console.log(`http listening on port: ${PORT}`);
});