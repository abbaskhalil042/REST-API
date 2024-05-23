import { v2 as cloudinary } from "cloudinary";
import { config } from "./config";

// Configuration
cloudinary.config({
  cloud_name: config.cloudinaryName,
  api_key:config.cloudinaryApi,
  api_secret: config.cloudinarySecret, // Click 'View Credentials' below to copy your API secret
});

export default cloudinary
