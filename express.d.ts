import { User } from "@prisma/client";
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
// import { User } from "./src/types/userTypes";

declare global{
    namespace Express{
        interface Request{
            user?: JwtPayload;
        }
    }
}
