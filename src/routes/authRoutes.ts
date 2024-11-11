import express, { Request, Response } from "express";
import { verifySignIn } from "../controllers/authController";

const router = express.Router();

router.post('/', verifySignIn);

export default router;