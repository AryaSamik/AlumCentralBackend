const express = require('express');
const protectRoute = require('../middlewares/protectRoute.js');
const Conversation = require('../models/conversation.js');
const Alumni = require('../models/user.js');
const router = express.Router();

// router.get('/conversations', protectRoute, async (req, res) => {
//     try {
//         const userId = req.sender._id;
//         const conversations = await Conversation.find({ participants: userId }).populate('participants');

//         const alumniIds = conversations
//             .map(conversation => conversation.participants.filter(participant => participant._id.toString() !== userId))
//             .flat()
//             .map(participant => participant._id);



//         const alumni = await Alumni.find({ _id: { $in: alumniIds } }, { userId: 0 }); // Exclude userId from response

//         res.status(200).json(alumni);
//     } catch (error) {
//         console.error('Error fetching conversations:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });
router.get('/conversations', protectRoute, async (req, res) => {
    try {
        const userId = req.sender._id;
        const conversations = await Conversation.find({ participants: userId }).populate('participants');

        // Extract alumniIds from conversations
        const alumniIds = conversations
            .map(conversation => conversation.participants.filter(participant => participant._id.toString() !== userId))
            .flat()
            .map(participant => participant._id);

   

        // Query alumni, excluding userId field from response
        const alumni = await Alumni.find({ _id: { $in: alumniIds,$ne: userId } });

        res.status(200).json(alumni);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;
