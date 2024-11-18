import { User } from "@prisma/client";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { prismaClient } from "../clients/db";

// return all the posts
export const getPosts = async(req: Request, res: Response): Promise<void> => {
    try{
        const posts = await prismaClient.post.findMany({
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
        console.log(posts);
        res.status(200).json(posts);
    }catch(error){
        res.status(500).json({error:`Error fetching posts ${error}`})
    }
}

// after creating post return post
export const createPosts = async(req: Request, res: Response): Promise<void> => {
    // console.log(req.user,req.body.content,req.body.imageUrl);
    const {content, imageUrl} = req.body;
    const {user} = req.user as JwtPayload;

    try{
        const post = await prismaClient.post.create({
            data:{
                content: content,
                imageUrl: imageUrl,
                author: {connect: {id: user.id }}
            }
        })
        res.status(200).json(post)
    }catch(error){
        res.status(500).json({error:`error creating post ${error}`})
    }
    
}
