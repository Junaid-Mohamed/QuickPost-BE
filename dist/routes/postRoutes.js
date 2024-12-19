"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const postsController_1 = require("../controllers/postsController");
const multer_1 = __importDefault(require("../middleware/multer"));
const router = express_1.default.Router();
router.get('/', authController_1.verifySignIn, postsController_1.getPosts);
router.post('/', authController_1.verifySignIn, multer_1.default.single("file"), postsController_1.createPost);
router.put('/like', authController_1.verifySignIn, postsController_1.updatePostWithLikes);
exports.default = router;
