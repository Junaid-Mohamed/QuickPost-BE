import express, { Request, Response } from "express";
import { verifySignIn } from "../controllers/authController";
import { deleteUserPostById, getUserById, getUserPosts, updateUserPostById } from "../controllers/userController";

const router = express.Router();

router.get('/', verifySignIn,getUserById);
router.get('/posts', verifySignIn,getUserPosts);
router.delete('/:id',verifySignIn, deleteUserPostById)
router.put('/:id', verifySignIn, updateUserPostById)

export default router;