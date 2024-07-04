const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../config/env");

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, JWT_KEY, {
        expiresIn: "10d",
    });
    // console.log(token);
    res.cookie("jwt", token, {
        maxAge: 15*24*60*60*1000,
        httpOnly: true,
        sameSite: "strict"
    });
}

module.exports = generateTokenAndSetCookie;