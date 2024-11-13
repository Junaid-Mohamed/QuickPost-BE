import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { Request, Response } from "express";
import { prismaClient } from "../clients/db";

interface GoogleTokenResult {
    iss?: string;
    azp?: string;
    aud?: string;
    sub?: string;
    email: string;
    email_verified: string;
    nbf?: string;
    name?: string;
    picture?: string;
    given_name: string;
    family_name?: string;
    iat?: string;
    exp?: string;
    jti?: string;
    alg?: string;
    kid?: string;
    typ?: string;
    status?: number;
    response?: object;
}

interface EmailAndPasswordInput {
    email: string | undefined;
    password: string | undefined;
}

const verifyEmailAndPassword = async ({email,password}:EmailAndPasswordInput)=>{
    const user = await prismaClient.user.findUnique({
        where: {email: email}
    });
    if(user && user.password === password){
        return user;
    }
    return null;
}

const verifyGoogleCred = async (token:string) => {
    try{
        const googleOauthURL = new URL("https://oauth2.googleapis.com/tokeninfo");
        googleOauthURL.searchParams.set(`id_token`,token);
        const {data} = await axios.get<GoogleTokenResult>(googleOauthURL.toString(),
        {
            responseType: "json",
        }
    );
    const user = await prismaClient.user.findUnique({
        where: {
            email: data.email
        }
    })

    return user;

    }catch(error){
        throw error;
    }
}

export const verifySignIn = async (req: Request, res: Response): Promise<void> =>{
    const {token,email,password} = req.body;
    let user;
    if(email && password){
        user = await verifyEmailAndPassword({email,password});
    } else if(token) {
        try{
            user = await verifyGoogleCred(token)
        }catch(error){
        console.log(error);
        res.status(400).json({message:'Invalid token provided.'});
        return;
        }
        
    } else{
        res.status(400).json({message:"Bad request, login details not provided properly."});
        return;
    }
    
    if(!user){
         res.status(404).json({message:"User not found, please signup"})
    }
   
}



    // if(!user){
    //     await prismaClient.user.create({
    //         data: {
    //             email: data.email,
    //             firstName: data.given_name,
    //             lastName: data.family_name,
    //             profileImageURL: data.picture
    //         }
    //     })
    // }

    // console.log(data);
    // res.status(200).json({message:'done'});