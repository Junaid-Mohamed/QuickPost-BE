import express, { Request, Response } from "express";
import { signIn, signUp, verifySignIn, verifyToken } from "../controllers/authController";

const router = express.Router();

router.post('/signin', signIn);
router.post('/signup', signUp);
router.get('/signin', verifyToken)

export default router;