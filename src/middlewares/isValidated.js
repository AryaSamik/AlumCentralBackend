const jwt =require('jsonwebtoken');
const admin=require('../models/admin');
const {JWT_KEY}=require('../config/env');

const isValidated=async(req,res,next)=>{
    try {
        // Verify the token
        const verifiedToken = jwt.verify(req.headers.authorization.split(' ')[1], JWT_KEY);

        // If token is not valid, then send a response
        if (!verifiedToken) {
            return res.status(404).send({
                status: 404,
                message: "Invalid token"
            });
        }

        // If token is valid, then search for admin in the database
        const adminExists = await admin.findOne({ email: verifiedToken.email });

        // If admin is not found, then send a response
        if (!adminExists) {
            return res.status(404).send({
                status: 404,
                message: "Admin not found"
            });
        }

        // Move to next function
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            status: 500,
            message: "Internal server error"
        });
    }
};

module.exports = isValidated;
