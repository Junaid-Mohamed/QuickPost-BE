import { Request, Response } from "express";

export const getUser = (req: Request, res: Response): void => {

    res.status(200).json({message:'user details'})
}