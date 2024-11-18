import express, { Request, Response } from "express";
import { verifySignIn } from "../controllers/authController";
import { getUserById, getUserPosts } from "../controllers/userController";

const router = express.Router();

router.get('/', verifySignIn,getUserById);
router.get('/posts', verifySignIn,getUserPosts);

export default router;