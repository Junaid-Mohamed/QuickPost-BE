import express, { Request, Response } from "express";
import { signUp, verifySignIn } from "../controllers/authController";

const router = express.Router();

router.post('/signin', verifySignIn);
router.post('/signup', signUp);

export default router;