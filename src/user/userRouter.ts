import express, { Request, Response } from "express"
import { createUser, login } from "./userController";

const userRouter=express.Router();



userRouter.post("/register",createUser)

userRouter.post("/login",login)


export  {userRouter}