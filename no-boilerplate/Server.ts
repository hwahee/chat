import Koa from 'koa'

const app=new Koa()

app.use(async (ctx)=>{
    ctx.body="hello! world!"
})

const PORT=8080
app.listen(PORT, ()=>{
    console.log(`Server listening on port: ${PORT}`)
})