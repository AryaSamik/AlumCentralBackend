const { Server } = require("socket.io"); // Correct way to import Server from socket.io
const http = require("http");
const express = require("express");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin:["http://localhost:3001", "http://localhost:3001", "https://alum-central-frontend.vercel.app"],
        // optionSucceessStatus:200,
        methods:["POST","GET","DELETE","PATCH"],
    },
});

const userSocketMap = {}; // Define userSocketMap before using it

const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId != "undefined") userSocketMap[userId] = socket.id;

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // socket.on() is used to listen to the events. can be used both on client and server side
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

module.exports = { app, io, server };
module.exports.getReceiverSocketId = getReceiverSocketId; // Export the function separately if needed
