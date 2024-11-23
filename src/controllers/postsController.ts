import { User } from "@prisma/client";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { prismaClient } from "../clients/db";
import cloudinary from "../utils/cloudinary";

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
    
        res.status(200).json(posts);
    }catch(error){
        res.status(500).json({error:`Error fetching posts ${error}`})
    }
}

// after creating post return post
export const createPost = async(req: Request, res: Response): Promise<void> => {
    const {content} = req.body;
    const {user} = req.user as JwtPayload;

    try{

        let imageUrl = null;
        let resourceType=null;
        if(req.file){
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: `posts/${user.id}-${user.firstName}`,
                resource_type: 'auto'
            })
            imageUrl = uploadResult.secure_url;
            resourceType = uploadResult.resource_type;
        }


        const post = await prismaClient.post.create({
            data:{
                content,
                imageUrl,
                resourceType,
                author: {connect: {id: user.id }}
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
        res.status(200).json(post)
    }catch(error){
        res.status(500).json({error:`error creating post ${error}`})
    }
    
}

export const updatePostWithLikes = async(req: Request, res: Response): Promise<void> =>{
    const {postId, liked} = req.body;
    try{
        const updatedPost = await prismaClient.post.update({
            where:{
                id: postId
            },
            data:{
                likes: !liked? {increment: 1} : {decrement: 1}
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
        res.status(500).json({error:`couldnot update the post with likes ${error}`})
    }
}

