import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt"

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  //^ validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "all fields are reqired !");

    return next(error);

    //   return  res.json({message:"all fields are required!"}) //^ aise bhi kar sakte hai but humne global error handling banaya hai that why iska use nahi karenge
  }

  //^check whether user exist or not

  const user = await userModel.findOne({ email });

  if (user) {
    const error = createHttpError(400, "user already exists");
    return next();
  }



  //^ now lets hash the password

  const hashedPass=await bcrypt.hash(password,10) 

  res.json({ message: "user registered !" });
};

export { createUser };
