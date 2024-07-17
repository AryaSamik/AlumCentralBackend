const cors = require("cors");
const express = require("express");
const bodyparser = require('body-parser');
const cookieParser = require("cookie-parser");
require('dotenv').config();
const DB = require('./src/config/db');
const adminRouter = require('./src/routes/admin');
const alumniRouter = require('./src/routes/alumni');
const messageRouter = require('./src/routes/message');
const conversationRouter = require('./src/routes/converstion');
const { app, server } = require("./src/socket/socket");

// CORS configuration
const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:3001", "https://alum-central-frontend.vercel.app"],
    methods: ["POST", "GET", "DELETE", "PATCH"],
    credentials: true
};

// Middleware
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/uploads', express.static('uploads')); // Serve static files from the uploads directory

// Routes
app.use('/admin', adminRouter);
app.use('/alumni', alumniRouter);
app.use('/messages', messageRouter);
app.use('/users', conversationRouter);

// Server listening
const port = process.env.PORT || 8000;
server.listen(port, () => {
    console.log(`Server running at port ${port}`);
});

// Root route
app.get("/", (req, res) => {
    res.send("Server is up and running at port " + port);
});

// Handle non-existing routes
app.all("*", (req, res) => {
    res.status(400).json({
        message: "Route does not exist"
    });
});
