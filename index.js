const cors=require("cors");
const corsOption={
    origin:["http://localhost:3001", "http://localhost:3000", "https://alum-central-frontend.vercel.app"],
    optionSucceessStatus:200,
    credentials: true
};
require('dotenv').config();
const DB=require('./src/config/db');
const express=require("express");
const bodyparser=require('body-parser');
const adminRouter=require('./src/routes/admin');
const alumniRouter=require('./src/routes/alumni');
const cookieParser = require("cookie-parser");
const messageRouter = require('./src/routes/message');
const conversationRouter=require('./src/routes/converstion');

const app=express();
app.use(express.json());
app.use(cors(corsOption));
app.use('/uploads', express.static('uploads')); // Serve static files from the uploads directory
app.use(cookieParser());

app.use('/admin',adminRouter);
app.use('/alumni',alumniRouter);
app.use('/messages',messageRouter);
app.use('/users',conversationRouter);

const port=process.env.PORT||8000;

app.listen(port,()=>{
    console.log(`Server running at port ${port}`);
});

app.get("/",(req,res)=>{
    res.send("Sever is up and running at port"+ port);
});

app.all("*",(req, res) => {
    res.status(400).json({
        message: "Route does not exist"
    })
})