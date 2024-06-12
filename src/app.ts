import express, { NextFunction, Request, Response } from "express";
import globalErrorHandlers from "./middlewares/globalErrorHandlers";
import { userRouter } from "./user/userRouter";
import bookRouter from "./book/bookRouter";
import cors from "cors";
import { config } from "./config/config";

const app = express();
app.use(express.json())//^agr tumhe res.json() send karna hai ye important hai- > used for json parsing

//routes

app.use(cors({
    // origin:"http://localhost:3000",
    origin:config.frontendUrl
}))
app.use("/api/users",userRouter)
app.use("/api/books",bookRouter)

//&*gloabal error handlers

app.use(globalErrorHandlers);

export default app;

//yaha par server run nahi karenge yaha par only setup hoga
