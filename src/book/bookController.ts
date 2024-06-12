import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";
import path from "node:path";
import bookModel from "./bookModel";
import fs from "node:fs";
import { AuthRequest } from "../middlewares/authenticate";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  // console.log("Files object:", files.coverImage, files.file);

  // Check if coverImage and file are present in the files object
  if (!files.coverImage || !files.coverImage[0]) {
    return next(createHttpError(400, "Cover image is required"));
  }
  if (!files.file || !files.file[0]) {
    return next(createHttpError(400, "Book file is required"));
  }

  // Mimetype - application/pdf or image
  const coverImageMimeType = files.coverImage[0].mimetype.split("/").pop();
  // console.log("Cover image mimetype:", coverImageMimeType);

  // File name
  const fileName = files.coverImage[0].filename;
  // console.log("Cover image filename:", fileName);

  // File path
  const filePath = path.resolve(
    __dirname,
    "../../public/data/uploads", // From book directory to public
    fileName
  );
  // console.log("Cover image file path:", filePath);

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });
    // console.log("Cover image upload result:", uploadResult);

    //^ PDF book upload
    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );
    // console.log("Book file path:", bookFilePath);

    const bookFileResult = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: bookFileName,
      folder: "book-files",
      format: "pdf",
    });
    // console.log("Book file upload result:", bookFileResult);

    //@ts-ignore //*ignore the error
    // console.log(req.userId);

    const _req = req as AuthRequest; //* either do this or you can make the req:AuthRequest in main function

    const newBook = await bookModel.create({
      title,
      genre,
      author: _req.userId,
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

//updateBook

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { bookId } = req.params;
  const { title, genre } = req.body;

  // const {file, coverImage} = req.files as { [fieldname: string]: Express.Multer.File[] };

  // const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  // console.log("update book files: ", files.coverImage, files.file);

  try {
    const book = await bookModel.findOne({ _id: bookId });

    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    const _req = req as AuthRequest;
    if (book.author.toString() !== _req.userId) {
      return next(createHttpError(403, "You cannot update others' book"));
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let completeCoverImage = "";
    if (files.coverImage) {
      const fileName = files.coverImage[0].filename;
      const coverMimeType = files.coverImage[0].mimetype.split("/").at(-1);

      const filePath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        fileName
      );

      completeCoverImage = fileName;
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: completeCoverImage,
        folder: "book-covers",
        format: coverMimeType,
      });

      completeCoverImage = uploadResult.secure_url;
      await fs.promises.unlink(filePath);
    }

    let completeFileName = "";

    if (files.file) {
      const bookFilePath = path.resolve(
        __dirname,
        "../../public/data/uploads" + files.file[0].filename
      );
      const bookFileName = files.file[0].filename;
      completeFileName = bookFileName;
      const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
        resource_type: "raw",
        filename_override: completeFileName,
        folder: "book-files",
        format: "pdf",
      });

      completeFileName = uploadResultPdf.secure_url;
      await fs.promises.unlink(bookFilePath);
    }

    const updatedBook = await bookModel.findOneAndUpdate(
      { _id: bookId },
      {
        title: title,
        genre: genre,
        coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
        file: completeFileName ? completeFileName : book.file,
      },
      { new: true }
    );

    res.json({ updatedBook });
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "Error in updating book"));
  }
};

const listBook = async (req: Request, res: Response, next: NextFunction) => {
  //*add pagination ......... with mongoosePagination package
  const books = await bookModel.find(); //it returns all books
  res.status(200).json(books);

  try {
  } catch (error) {
    return next(createHttpError(500, "Error in finding book"));
  }
  res.json({ msg: "list book" });
};

//* get single book

const getSigleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { bookId } = req.params;
  try {
    const book = await bookModel.findById(bookId);
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    return res.status(200).json(book);
  } catch (error) {
    return next(createHttpError(500, "Error in finding book"));
  }
  // res.status(200).json({ msg: "get single book" });
};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  const { bookId } = req.params;

  try {
    const book = await bookModel.findById(bookId);
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    const _req = req as AuthRequest;
    if (book.author.toString() !== _req.userId) {
      return next(createHttpError(403, "You cannot delete  others' book"));
    }

    const coverFileSplits = book.coverImage.split("/");
    const coverImagePublicId =
      coverFileSplits.at(-2) + "/" + coverFileSplits.at(-1)?.split(".").at(-2);
    // console.log("public image id ", coverImagePublicId);

    const bookFileSplits = book.file.split("/");
    const bookFilePublicId =
      bookFileSplits.at(-2) + "/" + bookFileSplits.at(-1);

    // console.log(bookFilePublicId)

    await cloudinary.uploader.destroy(coverImagePublicId);
    await cloudinary.uploader.destroy(bookFilePublicId, {
      resource_type: "raw",
    });

    await bookModel.deleteOne({ _id: bookId });

    return res.status(204).json({ msg: "Book deleted successfully" }); //*204 for deleted
  } catch (error) {
    return next(createHttpError(500, "Error in deleting book"));
  }
};

export { createBook, updateBook, listBook, getSigleBook, deleteBook };
