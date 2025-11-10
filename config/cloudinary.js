const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();

try {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary environment variables not set");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
} catch (error) {
  console.error("Failed to configure Cloudinary:", error);
}

module.exports = cloudinary;
