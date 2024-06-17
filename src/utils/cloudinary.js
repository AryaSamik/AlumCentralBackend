const cloudinary = require("cloudinary").v2;
const fs = require('fs');

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        // file has been uploaded successfully
        fs.unlinkSync(localFilePath); // remove the locally saved file
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // remove the locally saved file if upload failed
        console.error("Error uploading to Cloudinary", error); // Add error logging for debugging
        return null;
    }
};

module.exports = { uploadOnCloudinary };
