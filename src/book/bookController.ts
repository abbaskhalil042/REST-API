import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";
import path from "path";
import bookModel from "./bookModel";
import fs from "node:fs";
import { AuthRequest } from "../middlewares/authenticate";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  // console.log("Files object:", files);

  // Check if coverImage and file are present in the files object
  if (!files.coverImage || !files.coverImage[0]) {
    return next(createHttpError(400, "Cover image is required"));
  }
  if (!files.file || !files.file[0]) {
    return next(createHttpError(400, "Book file is required"));
  }

  // Mimetype - application/pdf or image
  const coverImageMimeType = files.coverImage[0].mimetype.split("/").pop();
  console.log("Cover image mimetype:", coverImageMimeType);

  // File name
  const fileName = files.coverImage[0].filename;
  console.log("Cover image filename:", fileName);

  // File path
  const filePath = path.resolve(
    __dirname,
    "../../public/data/uploads", // From book directory to public
    fileName
  );
  console.log("Cover image file path:", filePath);

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });
    console.log("Cover image upload result:", uploadResult);

    //^ PDF book upload
    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );
    console.log("Book file path:", bookFilePath);

    const bookFileResult = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: bookFileName,
      folder: "book-files",
      format: "pdf",
    });
    console.log("Book file upload result:", bookFileResult);


    //@ts-ignore //*ignore the error
    // console.log(req.userId);

    const _req=req as AuthRequest;//* either do this or you can make the req:AuthRequest in main function

    const newBook = await bookModel.create({
      title,
      genre,
      author:_req.userId,
      coverImage: uploadResult.secure_url,
      file: bookFileResult.secure_url,
    });

    //^ delete file after upload

    await fs.promises.unlink(filePath); //*server se delete ho jayega but cloud se nahi
    await fs.promises.unlink(bookFilePath);

    res.status(201).json({ id: newBook._id });
  } catch (error: any) {
    console.error("Error during file upload:", error);

    if (error.response) {
      // Cloudinary specific error
      console.error("Cloudinary error response:", error.response);
    }

    if (error.message.includes("Invalid Signature")) {
      return next(createHttpError(500, "Invalid Cloudinary signature"));
    }

    if (error.message.includes("File size exceeds")) {
      return next(createHttpError(400, "File size exceeds the limit"));
    }

    return next(createHttpError(500, "Error in uploading files"));
  }
};

export { createBook };
