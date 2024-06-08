import { config as conf } from "dotenv";
conf();

const _config = {
  port: process.env.PORT,
  databaseURL:process.env.MONGO_CONNECTION_STRING,
  env:process.env.NODE_ENV,
  jwtSecret:process.env.JWT_SECRET,
  cloudinaryName:process.env.
  CLOUDINARY_CLOUD_NAME,
  cloudinaryApi:process.env.CLOUDINARY_API,
  cloudinarySecret:process.env.CLOUDINARY_SECRET
};

export const config = Object.freeze(_config); //^readonly ho gya
