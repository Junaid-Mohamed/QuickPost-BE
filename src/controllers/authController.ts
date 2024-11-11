import axios from "axios";
import { Request, Response } from "express";

export const verifySignIn = async (req: Request, res: Response): Promise<void> =>{
    const token = req.body.token;
    const googleOauthURL = new URL("https://oauth2.googleapis.com/tokeninfo")
    // console.log(token);
    googleOauthURL.searchParams.set(`id_token`,token);
    // console.log(googleOauthURL.toString());
    const {data} = await axios.get(googleOauthURL.toString(), {
        responseType: 'json'
    });

    console.log(data);
    res.status(200).json({message:'done'});
}