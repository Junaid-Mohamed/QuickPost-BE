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

export const deleteUserPostById = async(req: Request, res: Response): Promise<void> => {
    const {user} = req.user as JwtPayload;
    const postId = req.params.id;

    try{
        const deletedPost = await prismaClient.post.delete({
            where:{
                id: postId
            },

        })
        res.status(200).json(deletedPost)
    }catch(error){
        res.status(500).json({error:`error delete post for user ${user.firstName}, error: ${error}`})
    }
}

export const updateUserPostById = async(req: Request, res: Response) : Promise<void> =>{
    const {user} = req.user as JwtPayload;
    const postId = req.params.id;
    const {editedContent} = req.body;
    console.log(editedContent);
    try{
        const updatedPost = await prismaClient.post.update({
            where: {
                id: postId
            },
            data: {
                content:editedContent
            },
            include:{
                author:{
                    select:{
                        firstName: true,
                        lastName: true,
                        profileImageURL: true
                    }
                }
            }
        })
        res.status(200).json(updatedPost);
    }catch(error){
        res.status(500).json({error:`error update post for user ${user.firstName}, error: ${error}`})
    }
}