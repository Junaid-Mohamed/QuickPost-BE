import express, { Request, Response } from "express";
import { verifySignIn } from "../controllers/authController";
import { deleteUserPostById, getBookmarkedPosts, getUserById, getUserPosts, updatePostWithBookmark, updateUserPostById } from "../controllers/userController";

const router = express.Router();

router.get('/', verifySignIn,getUserById);
router.get('/posts', verifySignIn,getUserPosts);
router.delete('/:id',verifySignIn, deleteUserPostById)
router.put('/:id', verifySignIn, updateUserPostById)
router.get('/posts/bookmark',verifySignIn, getBookmarkedPosts)
router.put("/posts/bookmark",verifySignIn, updatePostWithBookmark)
export default router;