import express, { Request, Response } from "express";
import { verifySignIn } from "../controllers/authController";
import { createPosts, getPosts } from "../controllers/postsController";

const router = express.Router();

router.get('/',verifySignIn,getPosts);
router.post('/',verifySignIn,createPosts);

export default router;