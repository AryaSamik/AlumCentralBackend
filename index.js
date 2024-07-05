const cors=require("cors");
const corsOption={
    origin:"*",
    optionSucceessStatus:200,
};
require('dotenv').config();
const DB=require('./src/config/db');
const express=require("express");
const bodyparser=require('body-parser');
const adminRouter=require('./src/routes/admin');
const alumniRouter=require('./src/routes/alumni');
const cookieParser = require("cookie-parser");
const messageRouter = require('./src/routes/message');

const app=express();
app.use(express.json());
app.use(cors(corsOption));
app.use('/uploads', express.static('uploads')); // Serve static files from the uploads directory
app.use(cookieParser());

app.use('/admin',adminRouter);
app.use('/alumni',alumniRouter);
app.use('/messages',messageRouter);

const port=process.env.PORT||8000;

app.listen(port,()=>{
    console.log(`Server running at port ${port}`);
});

app.get("/",(req,res)=>{
    res.send("Sever is up and running at port"+ port);
});