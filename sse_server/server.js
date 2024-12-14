const express=require('express');
const cors=require('cors');
const app=express();
const port=1800;
const globelEvents=new (require('events')).EventEmitter();
const os=require('os');
app.use(express.static('public'));
app.use(cors());
app.listen(port,()=>{
    console.log(`Server is listning on ${port}`);
    console.log(`Test at: http://localhost:${[port]}/ping`);
})
app.get('/ping',(req,res)=>{
    res.status(200).json({acknowledgeMessage:"server is working!"});
})
app.get('/create-stream',(req,res)=>{
    //set headers to tell this is an event stream
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    //Send initial message to the client
    res.write("data: stream connected\n\n");
    //every 1 second we can send current date and time to client
    const timePrintFunc=setInterval(()=>{
        const currentDate=`${new Date().toDateString()}${new Date().toLocaleTimeString()}`;
        console.log(`data: Current server time:${currentDate}`);
        res.write(`data: Current server time:${currentDate}\n\n`)
    },1000);
    //while connection is closed then clear the time function interval so server can stop that function 
    res.on('close',()=>{
        clearInterval(timePrintFunc);
    })
    globelEvents.on('say',()=>{
        res.write(`data: Hey ${os.userInfo().username}!This is message from another api through events module\n\n`)
    })
})

app.get("/say-hello",(_,res)=>{
    globelEvents.emit('say')
    res.status(200).send("Hello message Emitted");
})