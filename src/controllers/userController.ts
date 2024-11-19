import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { prismaClient } from "../clients/db";

export const getUserById = (req: Request, res: Response): void => {
    const {user} = req.user as JwtPayload;
    res.status(200).json(user)
}

export const getUserPosts = async(req:Request, res:Response): Promise<void> =>{
    const {user} = req.user as JwtPayload;
    try{
        const userPosts = await prismaClient.post.findMany({
            where:{
                authorId : user.id
            },
            include: {
                author:{
                    select:{
                        firstName: true,
                        lastName: true,
                        profileImageURL: true
                    }
                }
            }
        })
        res.status(200).json(userPosts);
    }
    catch(error){
        res.status(500).json({error:`error fetching posts details for user ${user.firstName}, error: ${error}`})
    }
}