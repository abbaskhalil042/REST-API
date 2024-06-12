// import { verify } from "crypto";
import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
// import { config } from "dotenv";

import { config } from "../config/config";

export interface AuthRequest extends Request {
  userId: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");

  if (!token) {
    return next(createHttpError(401, "Authorization token not found !"));
  }

  //if token found then parsed it

  try {
    
  const parsedToken = token.split(" ")[1];

  const decoded = verify(parsedToken, config.jwtSecret as string);
  //   console.log(decoded)

  const _req = req as AuthRequest;

  _req.userId = decoded.sub as string;
  next();
    
  } catch (error) {

    return next(createHttpError(401, "Token expired !"));
    
  }

};
export default authenticate;
