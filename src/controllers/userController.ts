import { Request, response, Response } from "express";
import { connect } from "http2";
import { JwtPayload } from "jsonwebtoken";
import { prismaClient } from "../clients/db";

export const getUserById = async(req: Request, res: Response): Promise<void> => {
    
    const {user} = req.user as JwtPayload;  
    try{
        const currentUser = await prismaClient.user.findUnique({
            where:{
                id:user.id
            },
            include:{
                bookmarkedPosts:  true,
                followers: true,
                followings: true
            }
        })
        res.status(200).json(currentUser);
    }catch(error){
        res.status(500).json({error:`error fetching user details for user ${user.firstName}, error: ${error}`}) 
    }
}

export const getSecondaryUser = async(req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;
    try{
        const secondaryUser = await prismaClient.user.findUnique({
            where:{
                id: userId
            },
            include:{
                posts: true,
                followers: true,
                followings: true
            }
        })
        res.status(200).json(secondaryUser);
    }catch(error){
        res.status(500).json({error:`error fetching user profile details, error: ${error}`}) 
    }
}


export const updateUserProfile = async (req:Request, res: Response): Promise<void> =>{
    const {user} = req.user as JwtPayload;
    const {profileImage, bio} = req.body;
    try{
        const udpatedUser = await prismaClient.user.update({
            where:{
                id: user.id
            },
            data:{
                bio,
                profileImageURL: profileImage
            }
        })
        res.status(200).json(udpatedUser)
    }catch(error){
        res.status(500).json({error:`error updating user details for user ${user.firstName}, error: ${error}`})
    }
    
}

export const getUserPosts = async(req:Request, res:Response): Promise<void> =>{
    
    const userId = req.params.id;
    try{
        const userPosts = await prismaClient.post.findMany({
            where:{
                authorId : userId
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
        res.status(500).json({error:`error fetching posts details for user ${userId}, error: ${error}`})
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

export const getBookmarkedPosts = async(req: Request, res: Response): Promise<void> =>{
    const {user} = req.user as JwtPayload;
    try{
        const userWithBookmarks = await prismaClient.user.findUnique({
            where: {id: user.id},
            include: {bookmarkedPosts: {
                include: {
                    author: true
                }
            }},
        })
        res.status(200).json(userWithBookmarks);
    }catch(error){
        res.status(500).json({error:`error to get bookmarked posts for user ${user.firstName}, error: ${error}`}) 
    }

}

export const updatePostWithBookmark = async(req: Request, res: Response): Promise<void> =>{
    const {user} = req.user as JwtPayload;
    const {postId, isBookmarked} = req.body;
    try{ 
        const updatedUserWithBookmark = await prismaClient.user.update({
            where:{
                id: user.id
            },
            data:{
                bookmarkedPosts: isBookmarked === true ? {connect: {id: postId}} : {disconnect:{id: postId}}
            },
            include: {bookmarkedPosts: {
                include:{
                    author: true
                }
            }}

        })
        res.status(200).json(updatedUserWithBookmark);
    }catch(error){
        res.status(500).json({error:`error to get bookmarked posts for user ${user.firstName}, error: ${error}`}) 
    }
}

//  follows functionality

export const updateFollow = async(req: Request, res:Response): Promise<void> =>{

    const {from,to,follow} = req.body;
    try{
        if(follow){
            await prismaClient.follows.create({
                data:{
                    follower: {connect: {id:from}},
                    following: {connect: {id:to}}
                }
            })
        }else{
            await prismaClient.follows.delete({
                where: {followerId_followingId: {followerId:from, followingId:to}}
            })
        }
        res.status(200).json({message:"updated successfully"})

    }catch(error){
        res.status(500).json({error:`error to followUser ${error}`})
    }

}

