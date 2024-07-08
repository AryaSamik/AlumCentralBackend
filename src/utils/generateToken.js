const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../config/env");

const generateTokenAndSetCookie = (userId, req, res) => {
    const token = jwt.sign({userId}, JWT_KEY, {
        expiresIn: "10d",
    });

    res.cookie("jwt", token, {
        maxAge: 15*24*60*60*1000,
        // httpOnly: true,
        sameSite: 'Lax',
        secure: true
    });
    req.token = token;
}

module.exports = generateTokenAndSetCookie;