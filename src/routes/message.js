const express = require('express');
const Message = require('../models/message.js');
const protectRoute = require('../middlewares/protectRoute.js')
const Conversation = require('../models/conversation.js');
const { getReceiverSocketId ,io } = require('../socket/Server.js');

const router = express.Router();

//to send messages to :id
router.post("/send/:id", protectRoute, async(req, res) => {
    try{     
        let newMessage = new Message({
            receiverId: req.params.id,
            senderId: req.sender._id,
            message: req.body.message,
        });
        
        let conversation = await Conversation.findOne({
            participants:{$all: [newMessage.senderId, newMessage.receiverId]}
        });
        
        if(!conversation){
            conversation = await Conversation.create({
                participants: [newMessage.senderId, newMessage.receiverId],
            });
        }
           
        if(newMessage){
            conversation.messages.push(newMessage._id);
        }
        
        // await conversation.save();
        // await newMessage.save();
        
        //this will run in parallel
        await Promise.all([conversation.save(), newMessage.save()]);
        
        //SOCKET IO FUNCTIONALITY WILL GO HERE
        const receiverSocketId = getReceiverSocketId(req.params.id);
        if(receiverSocketId){
            //io.to(<socketId>).emit() used to send events to specific client
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(200).json({
            message: 'Message sent',
            newMessage: newMessage
        });
    } catch(err) {
        console.log(err);
        res.status(err.status).json({"message": 'Internal Server Error'});
    }
});

//to get messages sent to :id
router.get("/:id", protectRoute, async (req, res) => {
    try{
        const receiverId = req.params.id;
        const senderId = req.sender._id;
        
        //participants array must contain ALL the ids
        let conversation = await Conversation.findOne({participants:{$all: [senderId, receiverId]}}).populate('messages');

        if(!conversation){
            return res.status(200).json({messages: []});
        }

        res.status(200).json({messages: conversation.messages});
    } catch(err) {
        console.log(err);
        res.status(err.status).json({message: 'Internal Server Error'});
    }
});

module.exports = router;