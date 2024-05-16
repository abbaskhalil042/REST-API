import { NextFunction, Request, Response } from "express";

const createBook=async (req: Request, res: Response, next: NextFunction) => {


    // const { }

    res.json({msg:"book created "})
    
}

export {createBook}