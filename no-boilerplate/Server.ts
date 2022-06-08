import Koa from 'koa'
import serve from 'koa-static'
import path from 'path'

const app=new Koa()

app.use(serve(path.join(__dirname, 'build')))

const PORT=8080
app.listen(PORT, ()=>{
    console.log(`Server listening on port: ${PORT}`)
})