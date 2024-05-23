import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";

import path from "node:path";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  // const { }

//   console.log("files", req.files);

  const files = req.files as { [filename: string]: Express.Multer.File[] };

  //mimetype- application/pdf or imagae
  const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);

  //*file name
  const fileName = files.coverImage[0].filename;


  //*filepath

  const filePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    fileName
  );



  const uploadResult = await cloudinary.uploader.upload(filePath, {
    filename_override: fileName,
    folder: "book-covers",
    format: coverImageMimeType,
  });


  console.log("uploadepath",uploadResult)

  res.json({});
};

export { createBook };
