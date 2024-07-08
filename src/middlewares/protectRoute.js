const jwt = require("jsonwebtoken");
const Alumni = require("../models/user");

const protectRoute = async (req, res, next) => {
  try {
    console.log(req.cookies.jwt);
    if(!req.cookies.jwt){
        return res.status(401).send({message:"No user logged in"});
    }
    let decoded = jwt.verify(req.cookies.jwt, process.env.JWT_KEY);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }
    let sender = await Alumni.findOne({ _id: decoded.userId });
    if (!sender) {
      return res.status(400).json({ message: "Sender not found" });
    }
    if(sender._id.toString() === req.params.id){
      return res.status(400).json({message: 'Cannot send messages to self'});
    }
    req.sender = sender;
    next();
  } catch (err) {
    console.log(err);
    res.status(err.status).json({ message: "Internal Server Error" });
  }
};

module.exports = protectRoute;
