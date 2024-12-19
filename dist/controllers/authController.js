"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignIn = exports.verifyToken = exports.signUp = exports.signIn = void 0;
const axios_1 = __importDefault(require("axios"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../clients/db");
const jwt_1 = __importDefault(require("../services/jwt"));
const verifyEmailAndPassword = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password }) {
    const user = yield db_1.prismaClient.user.findUnique({
        where: { email: email },
        // select: {email:true,password:true}
    });
    if (user && typeof user.password === "string") {
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Password Invalid");
        }
        return user;
    }
    return null;
});
const verifyGoogleCred = (token, isSignup) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const googleOauthURL = new URL("https://oauth2.googleapis.com/tokeninfo");
        googleOauthURL.searchParams.set(`id_token`, token);
        const { data } = yield axios_1.default.get(googleOauthURL.toString(), {
            responseType: "json",
        });
        let user = yield db_1.prismaClient.user.findUnique({
            where: {
                email: data.email
            }
        });
        if (user && isSignup) {
            throw new Error("User already registered with this email, please login");
        }
        if (!user && isSignup) {
            user = yield db_1.prismaClient.user.create({
                data: {
                    email: data.email,
                    firstName: data.given_name,
                    lastName: data.family_name,
                    profileImageURL: data.picture,
                    googleId: data.sub
                }
            });
        }
        return user;
    }
    catch (error) {
        throw error;
    }
});
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, email, password } = req.body;
    let user;
    if (email && password) {
        try {
            user = yield verifyEmailAndPassword({ email, password });
        }
        catch (error) {
            res.status(400).json({ error: 'Invalid password' });
            return;
        }
    }
    else if (token) {
        try {
            user = yield verifyGoogleCred(token, false);
        }
        catch (error) {
            res.status(400).json({ error: 'Invalid token provided.' });
            return;
        }
    }
    else {
        res.status(400).json({ error: "Bad request, login details not provided properly." });
        return;
    }
    if (user) {
        const JWTtoken = jwt_1.default.generateTokenForUser(user);
        res.status(200).json({ token: JWTtoken });
        return;
    }
    else {
        res.status(404).json({ error: "User not found, please signup" });
        return;
    }
});
exports.signIn = signIn;
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, token } = req.body;
    let userInDB;
    if (token) {
        try {
            userInDB = yield verifyGoogleCred(token, true);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: "User already registered with this email, please login" });
            }
            else {
                res.status(500).json({ error: "An unexpected error occurred" });
            }
            return;
        }
    }
    else if (firstName && email && password) {
        userInDB = yield db_1.prismaClient.user.findUnique({
            where: {
                email: email
            }
        });
        if (userInDB) {
            res.status(500).json({ error: "User already registered with this email, please login" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        userInDB = yield db_1.prismaClient.user.create({
            data: {
                email: email,
                firstName: firstName,
                password: hashedPassword
            }
        });
    }
    else {
        res.status(400).json({ message: "required fields are not provided." });
        return;
    }
    if (!userInDB) {
        res.status(500).json({ message: "User creation failed." });
        return;
    }
    else {
        res.status(200).json({ message: "user signup successfull. please login now." });
        return;
    }
});
exports.signUp = signUp;
// try{
//     const currentUser = await prismaClient.user.findUnique({
//         where:{
//             id:user.id
//         },
//         include:{
//             bookmarkedPosts:  true,
//             followers: true,
//             followings: true
//         }
//     })
//     res.status(200).json(currentUser);
// }catch(error){
//     res.status(500).json({error:`error fetching user details for user ${user.firstName}, error: ${error}`}) 
// }
const verifyToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (token) {
        const user = jwt_1.default.verifyToken(token);
        res.status(200).json(user);
    }
    else {
        res.status(404).json({ error: "token not found please login again" });
    }
});
exports.verifyToken = verifyToken;
//  this will verify the JWT and act as middleware to other protected routes
const verifySignIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: "token not found please login again" });
            return;
        }
        const user = jwt_1.default.verifyToken(token);
        req.user = user;
        next();
    }
    catch (error) {
        res.status(500).json({ error: "Failed to authenticate token" });
    }
});
exports.verifySignIn = verifySignIn;
