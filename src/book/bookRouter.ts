import path from "node:path";
import express from "express";
import { createBook } from "./bookController";
import multer from "multer";

const bookRouter = express.Router();

//multer store in local file then we will store that in cloudinary
const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),

  limits: { fileSize: 3e7 }, //30MB= 30*1024*1024
});

//
bookRouter.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    {
      name: "file",
      maxCount: 1,
    },
  ]),
  createBook
);

export default bookRouter;
