const cors = require("cors");
const express = require("express");
const bodyparser = require('body-parser');
const cookieParser = require("cookie-parser");
require('dotenv').config();
const DB = require('./src/config/db'); // Ensure this is correctly configured and connects to your database

const adminRouter = require('./src/routes/admin');
const alumniRouter = require('./src/routes/alumni');
const messageRouter = require('./src/routes/message');
const conversationRouter = require('./src/routes/converstion');

const app = express();
const port = process.env.PORT || 8000;

const corsOptions = {
    origin: 'https://alumcentralbackend-1.onrender.com', // Your frontend domain
    credentials: true, // Allow cookies to be sent with requests
    optionsSuccessStatus: 200
};

app.use(express.json());
app.use(cors(corsOptions));
app.use('/uploads', express.static('uploads')); // Serve static files from the uploads directory
app.use(cookieParser());

app.use('/admin', adminRouter);
app.use('/alumni', alumniRouter);
app.use('/messages', messageRouter);
app.use('/users', conversationRouter);

app.get("/", (req, res) => {
    res.send("Server is up and running at port " + port);
});

app.all("*", (req, res) => {
    res.status(400).json({
        message: "Route does not exist"
    });
});

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});
