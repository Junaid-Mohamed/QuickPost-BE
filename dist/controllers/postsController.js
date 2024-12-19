"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostWithLikes = exports.createPost = exports.getPosts = void 0;
const db_1 = require("../clients/db");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
// return all the posts
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield db_1.prismaClient.post.findMany({
            include: {
                author: {
                    select: {
                        firstName: true,
                        lastName: true,
                        profileImageURL: true,
                        followings: true,
                        followers: true
                    }
                }
            }
        });
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json({ error: `Error fetching posts ${error}` });
    }
});
exports.getPosts = getPosts;
// after creating post return post
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content } = req.body;
    const { user } = req.user;
    try {
        let imageUrl = null;
        let resourceType = null;
        if (req.file) {
            const uploadResult = yield cloudinary_1.default.uploader.upload(req.file.path, {
                folder: `posts/${user.id}-${user.firstName}`,
                resource_type: 'auto'
            });
            imageUrl = uploadResult.secure_url;
            resourceType = uploadResult.resource_type;
        }
        const post = yield db_1.prismaClient.post.create({
            data: {
                content,
                imageUrl,
                resourceType,
                author: { connect: { id: user.id } }
            },
            include: {
                author: {
                    select: {
                        firstName: true,
                        lastName: true,
                        profileImageURL: true
                    }
                }
            }
        });
        res.status(200).json(post);
    }
    catch (error) {
        res.status(500).json({ error: `error creating post ${error}` });
    }
});
exports.createPost = createPost;
const updatePostWithLikes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, liked } = req.body;
    try {
        const updatedPost = yield db_1.prismaClient.post.update({
            where: {
                id: postId
            },
            data: {
                likes: !liked ? { increment: 1 } : { decrement: 1 }
            },
            include: {
                author: {
                    select: {
                        firstName: true,
                        lastName: true,
                        profileImageURL: true
                    }
                }
            }
        });
        res.status(200).json(updatedPost);
    }
    catch (error) {
        res.status(500).json({ error: `couldnot update the post with likes ${error}` });
    }
});
exports.updatePostWithLikes = updatePostWithLikes;
