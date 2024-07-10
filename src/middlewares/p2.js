const jwt = require("jsonwebtoken");
const Alumni = require("../models/user");
const { JWT_KEY } = require('../config/env');

const p2 = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "No user logged in" });
        }

        const decoded = jwt.verify(token, JWT_KEY);
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const sender = await Alumni.findOne({ _id: decoded.userId });
        if (!sender) {
            return res.status(400).json({ message: "Sender not found" });
        }

        if (sender._id.toString() === req.params.id) {
            return res.status(400).json({ message: 'Cannot send messages to self' });
        }

        req.sender = sender;
        next();
    } catch (err) {
        console.error("Middleware error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = p2;
