const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Admin = require('../models/admin');
const { JWT_KEY } = require('../config/env.js');
const isValidated = require('../middlewares/isValidated.js'); 
// corrected filename
const upload = require('../middlewares/multer');
const { uploadOnCloudinary } = require('../utils/cloudinary');
const generateTokenAndSetCookie = require('../utils/generateToken.js');
const router = express.Router();

const invalidCredentialsError = {
    status: 404,
    message: "Invalid email or password"
};

router.use(express.json());


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Admin.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Invalid credentials' });
        }
        if(!user.verified){
            return res.status(401).json({
                message: "Admin verification pending"
            })
        }
        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return res.status(404).json({ message: 'Invalid credentials' });
        }
        // const token = jwt.sign({ email: user.email }, JWT_KEY, { expiresIn: '1d' });
        generateTokenAndSetCookie(user._id, req, res);
        return res.status(200).json({
            admin: user,
            status: 200,
            message: "Logged in successfully",
            token: req.token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/logout", (req, res) => {
    try{
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "None",
            secure: true
        });
        res.status(200).send({message: 'Admin logged out successfully'});
    } catch(error) {
        console.log(err);
        res.status(err.status).json({message: "Internal Server Error"});
    }
})
                                         
                                                                          
router.get('/verify-token', isValidated, (req, res) => {
    res.status(200).send({
        status: 200,
        message: "You have accessed a protected route",
        user: req.user
    });
});

router.post("/register", upload.single('image') , async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await Admin.findOne({ email });
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
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({
            name,
            image:imageUrl,
            email,
            password: hashedPassword,
        });
        await newAdmin.save();
        return res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
    
});
router.get("/all",async(req,res)=>{
    try {
        const admin= await Admin.find({});
        res.status(200).json(admin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.post('/verify/:id', async (req, res) => {
    try {
        const admin = await Admin.findByIdAndUpdate(req.params.id, { verified: true }, { new: true });
        if (!admin) return res.status(404).json({ message: 'Admin not found' });
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete alumni
router.delete('/delete/:id', async (req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id);
        if (!admin) return res.status(404).json({ message: 'Admin not found' });
        res.json({ message: 'Admin deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;
