import express, { Request, Response } from "express";
import { verifySignIn } from "../controllers/authController";
import { createPost, getPosts, updatePostWithLikes } from "../controllers/postsController";
import upload from "../middleware/multer";

const router = express.Router();

router.get('/',verifySignIn,getPosts);
router.post('/',verifySignIn,upload.single("file") ,createPost);
router.put('/like', verifySignIn, updatePostWithLikes)

export default router;