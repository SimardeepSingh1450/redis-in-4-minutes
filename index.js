const express = require('express');
const redis = require('redis');

//redis-setup-code
const redisUrl = "redis://127.0.0.1:6379"
const client = redis.createClient(redisUrl);
client.connect();
client.on('connect',(err)=>{
    console.log('Redis connected!')
})

const app = express();
app.use(express.json());

app.post('/setKeyValue',async(req,res)=>{
    const {key,value} = req.body;
    console.log(key,value);
    await client.set(key,JSON.stringify(value));
    console.log(`${key}:${value} has been set`)
    res.json(`${key}:${value} has been set`);
})

app.get('/:key',async(req,res)=>{
    const key = req.params.key;
    let cachedData = await client.get(key);
    if(cachedData){
        res.json(JSON.parse(cachedData));
    }else{
        res.json(`The Key(${key}) has no matching value in redis`)
    }
})

app.listen(8080,()=> {
    console.log('Server is listening on port-8080');
})