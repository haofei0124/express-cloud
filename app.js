const express = require('express')
const {MongoClient} = require('mongodb')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// const url = 'mongodb+srv://haofei0124:Chf%4063565349@clusterhc.y1wkoqa.mongodb.net/mytest?retryWrites=true&w=majority&appName=ClusterHC'
const url = process.env.MONGODB_URI
let db

async function connectDB() {
    const client = new MongoClient(url)
    await client.connect()
    db = client.db('mytest')

}

function getColl(name) {
    return db.collection(name)
}

app.get('/api/ff', async(req, res)=>{
    try{
        const coll = getColl('ff')
        const data = await coll.find().toArray()
        res.json({code: 200, data})
    }catch(err) {
        res.status(500).json({
            code: 500, 
            msg: '获取数据失败',
            error: err.message
        })
    }
})

app.post('/api/ff/add', async(req, res)=>{
    try{
    const {name, age} = req.body
        if(!name || !age) {
            res.status(400).json({
                code: 400,
                msg: '参数不完整'
            })
        }
    }catch(err){
        res.status(500).json({
            code: 500, 
            msg: '添加失败',
            error: err.message
        })
    }
    const {name, age} = req.body
    const coll = getColl('ff')
    const data = await coll.insertOne({name, age})
    res.json({code: 200}, data)
})

app.post('/api/ff/update', async(req, res)=>{
    try{
    const {name, age} = req.body
        if(!name || !age) {
            res.status(400).json({
                code: 400,
                msg: '参数不完整'
            })
        }
        const coll = getColl('ff')
        console.log('aaa', name, age)
        const data = await coll.updateOne({name}, {$set:{age}})
        res.json({code: 200}, data)
    }catch(err){
        res.status(500).json({
            code: 500, 
            msg: '添加失败',
            error: err.message
        })
    }
})

app.post('/api/ff/delete', async(req, res)=>{
    try{
    const {name} = req.body
        if(!name) {
            res.status(400).json({
                code: 400,
                msg: '参数不完整'
            })
        }
        const coll = getColl('ff')
        const data = await coll.deleteOne({name})
        res.json({code: 200}, data)
    }catch(err){
        res.status(500).json({
            code: 500, 
            msg: '删除失败',
            error: err.message
        })
    }
})

const PORT = process.env.PORT || 3001
connectDB().then(() => {
//   app.listen(PORT, () => {
//     // console.log(`Express 服务运行在 http://127.0.0.1:${PORT}`)
//     console.log(`Express 服务运行在 http://127.0.0.1:${PORT}`)
//   })
  app.listen(PORT, () => {
  console.log("服务运行在端口：", PORT);
});
})