const cors = require("cors");
const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv');
const app=express();
const adminRouter = require('./src/routes/admin');
const alumniRouter = require('./src/routes/alumni');
const messageRouter = require('./src/routes/message');
const conversationRouter = require('./src/routes/converstion');
const DB = require('./src/config/db'); // Ensure you are connecting to your DB here

dotenv.config();

const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:3001", "https://alum-central-frontend.vercel.app"],
    methods: ["POST", "GET", "DELETE", "PATCH"],
    credentials: true
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use('/admin', adminRouter);
app.use('/alumni', alumniRouter);
app.use('/messages', messageRouter);
app.use('/users', conversationRouter);

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});

app.all("*", (req, res) => {
    res.status(400).json({
        message: "Route does not exist"
    });
});
