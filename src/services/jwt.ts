import { User } from "@prisma/client";
import JWT from "jsonwebtoken";
import { prismaClient } from "../clients/db";

const JWT_SECRET = process.env.JWT_SECRET as string;

class JWTService{
    public static generateTokenForUser(user : User){
        const payload = {
            id: user?.id,
            email: user?.email
        }

        if(!JWT_SECRET){
            throw new Error("JWT_SECRET is not defined in the environment variables.")
        }
        const JWTtoken = JWT.sign(payload,JWT_SECRET);
        return JWTtoken;
    }
}

export default JWTService;