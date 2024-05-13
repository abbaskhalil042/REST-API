import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import UserType from "./userType";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  //^ validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "all fields are reqired !")
    return next(error);
  }

  //^check whether user exist or not
try {
  
  const user = await userModel.findOne({ email });

  if (user) {
    const error = createHttpError(400, "user already exists");
    return next(error);
  }
  
} catch (error) {

  return next(createHttpError(500,"error with getting user"))
  
}

  //^ now lets hash the password

  const hashedPass = await bcrypt.hash(password, 10);
  let newUser:UserType;
try {

   newUser = await userModel.create({
    name,
    email,
    password: hashedPass,
  });
  
} catch (error) {

  return next(createHttpError(500,"error while creating user"))

}


try {
    //^token generation

    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
    });
  
    res.status(201).json({ accessToken: token });
  
} catch (error) {

  return next(createHttpError(500,"Error while signing the jwt token"))
  
}

};

