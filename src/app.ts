import express, { NextFunction, Request, Response } from "express";
import globalErrorHandlers from "./middlewares/globalErrorHandlers";

const app = express();

//routes

app.get("/", (req: Request, res: Response, next: NextFunction) => {
 
  res.json({ message: "welcome to elib apis" });
});

//&*gloabal error handlers

app.use(globalErrorHandlers);

export default app;

//yaha par server run nahi karenge yaha par only setup hoga
