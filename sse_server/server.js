const express=require('express');
const cors=require('cors');
const app=express();
const port=1800;
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
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.write("data: stream connected\n\n");
    const timePrintFunc=setInterval(()=>{
        const currentDate=`${new Date().toDateString()}${new Date().toLocaleTimeString()}`;
        console.log(`data: Current server time:${currentDate}`);
        res.write(`data: Current server time:${currentDate}\n\n`)
    },1000);
})