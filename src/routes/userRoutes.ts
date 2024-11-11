import express, { Request, Response } from "express";
import { getUser } from "../controllers/userController";

const router = express.Router();

router.get('/', getUser)

export default router;