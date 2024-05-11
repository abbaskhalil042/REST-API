import express, { NextFunction, Request, Response } from "express";
import globalErrorHandlers from "./middlewares/globalErrorHandlers";
import { userRouter } from "./user/userRouter";

const app = express();
app.use(express.json())//^agr tumhe res.json() send karna hai ye important hai- > used for json parsing

//routes

app.use("/api/users",userRouter)



app.get("/", (req: Request, res: Response, next: NextFunction) => {
 
  res.json({ message: "welcome to elib apis" });
});

//&*gloabal error handlers

app.use(globalErrorHandlers);

export default app;

//yaha par server run nahi karenge yaha par only setup hoga
