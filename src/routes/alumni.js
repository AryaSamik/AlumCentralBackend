const express = require("express");
const Alumni = require('../models/user');
const upload = require('../middlewares/multer');
const { uploadOnCloudinary } = require('../utils/cloudinary');

const router = express.Router();
                                            
router.post('/register', upload.single('image'), async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Debug log for request body
        console.log("File:", req.file); // Debug log for file

        const { name, email, bitRollno, branch,admissionYear, graduationYear, tools, company, designation, message } = req.body;
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
            message

        });

        await newAlumni.save();
        return res.status(201).json({ message: 'Registration successful', alumni: newAlumni });
    } catch (error) {
        console.error("Error in /register route:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
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
