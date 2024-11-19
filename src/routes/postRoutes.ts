import express, { Request, Response } from "express";
import { verifySignIn } from "../controllers/authController";
import { createPosts, getPosts, updatePostWithLikes } from "../controllers/postsController";

const router = express.Router();

router.get('/',verifySignIn,getPosts);
router.post('/',verifySignIn,createPosts);
router.put('/like', verifySignIn, updatePostWithLikes)

export default router;