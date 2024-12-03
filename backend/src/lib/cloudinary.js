import { v2 as cloudinary } from "cloudinary";

import { config } from "dotenv"; // import { config } from 'dotenv' imports the config function from the dotenv package.

config(); // Call config() to load the environment variables from the .env file // Now, process.env will contain all the environment variables from the .env file

cloudinary.config({
  // Configure Cloudinary with credentials from environment variables, cloudinary.config() is a method provided by the Cloudinary Node.js SDK to configure the Cloudinary servic
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
