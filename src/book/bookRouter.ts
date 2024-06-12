import path from "node:path";
import express from "express";
import { createBook, deleteBook, getSigleBook, listBook, updateBook } from "./bookController";
import multer from "multer";
import authenticate from "../middlewares/authenticate";

const bookRouter = express.Router();

const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 2e7 }, //30MB= 30*1024*1024
});

//
bookRouter.post(
  "/",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    {
      name: "file",
      maxCount: 1,
    },
  ]),
  createBook
);

bookRouter.patch(
  "/:bookId",authenticate, upload.fields([
    { name: "coverImage", maxCount: 1 },
    {
      name: "file",
      maxCount: 1,
    },
  ]),updateBook)




  bookRouter.get("/", listBook)

  bookRouter.get("/:bookId", getSigleBook)

  bookRouter.delete("/:bookId",authenticate, deleteBook)


export default bookRouter;
