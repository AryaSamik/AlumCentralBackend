const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../config/env");

const generateTokenAndSetCookie = (userId, req, res) => {
    const token = jwt.sign({userId}, JWT_KEY, {
        expiresIn: "10d",
    });

    res.cookie("jwt", token, {
        maxAge: 10 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production"
    });
    req.token = token;
}

module.exports = generateTokenAndSetCookie;