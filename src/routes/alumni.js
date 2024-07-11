const express = require("express");
const Alumni = require('../models/user');
const upload = require('../middlewares/multer');
const { uploadOnCloudinary } = require('../utils/cloudinary');
const generateTokenAndSetCookie = require("../utils/generateToken.js");
const bcrypt = require("bcrypt");
const {isLoggedIn, isLoggedOut} = require("../middlewares/Login.js");
const protectRoute =require("../middlewares/protectRoute.js");

const router = express.Router();
                                            
router.post('/register', upload.single('image'), async (req, res) => {
    try {
        if(req.cookies.jwt){
            return res.status(400).json({message: 'A user is already logged in'})
        }
        console.log("Request Body:", req.body); // Debug log for request body
        console.log("File:", req.file); // Debug log for file

        const { name, email, bitRollno, branch,admissionYear, graduationYear, tools, company, designation, message, password } = req.body;
        const existingUser = await Alumni.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        let imageUrl = null;
        if (req.file) {
                const uploadResult = await uploadOnCloudinary(req.file.path);
            if (uploadResult) {
                imageUrl = uploadResult.secure_url;
                console.log("Image uploaded to Cloudinary:", imageUrl); // Debug log for Cloudinary URL
            } else {
                console.error("Failed to upload image to Cloudinary");
                return res.status(500).json({ message: 'Failed to upload image' });
            }
        } else {
            console.error("No file uploaded");
            return res.status(400).json({ message: 'No image file provided' });
        }

        let hashedPassword = null;
        hashedPassword = await bcrypt.hash(password, 10);

        const newAlumni = new Alumni({
            name,
            image: imageUrl,
            email,
            bitRollno,
            branch,
            admissionYear,
            graduationYear,
            tools,
            company,
            designation,
            message,
            password: hashedPassword,
        });
        
        await newAlumni.save();
        return res.status(201).json({
            message: 'Registration successful',
            alumni: newAlumni,
            token: req.token
        });
    } catch (error) {
        console.error("Error in /register route:", error);
        return res.status(500).json({ message: error.message });
    }
});

router.post("/login", isLoggedIn, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate the input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find the user by email
        const user = await Alumni.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: 'No such user exists' });
        }

        //Check for verified User
        if(!user.verified){
            return res.status(401).json({
                message: "User Verification pending"
            })
        }

        // Compare the provided password with the stored hashed password
        const passCheck = await bcrypt.compare(password, user.password);
        if (!passCheck) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        // Generate token and set cookie (assuming you have a function for this)
        generateTokenAndSetCookie(user._id, req, res);
        
        // Respond with success
        res.status(200).json({
            message: 'Logged in successfully',
            user: user,
            token: req.token
        });
    } catch (err) {
        console.error(err);
        // Ensure a valid status code is sent
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.post("/logout", isLoggedOut, async(req, res) => {
    try{
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "None",
            secure: true
        });
        res.status(200).send({message: 'Logged out successfully'});
    } catch(err) {
        console.log(err);
        res.status(err.status).json({message: "Internal Server Error"});
    }
})

router.get('/all', async (req, res) => {
    try {
        const alumni = await Alumni.find({});
        res.status(200).json(alumni);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.post('/verify/:id', async (req, res) => {
    try {
        const alumni = await Alumni.findByIdAndUpdate(req.params.id, { verified: true }, { new: true });
        if (!alumni) return res.status(404).json({ message: 'Alumnus not found' });
        res.json(alumni);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete alumni
router.delete('/delete/:id', async (req, res) => {
    try {
        const alumni = await Alumni.findByIdAndDelete(req.params.id);
        if (!alumni) return res.status(404).json({ message: 'Alumnus not found' });
        res.json({ message: 'Alumnus deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;
