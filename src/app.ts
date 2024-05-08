import express, { NextFunction, Request, Response } from "express";

const app = express();

//routes

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "welcome to elib apis" });
});

export default app;

//yaha par server run nahi karenge yaha par only setup hoga
