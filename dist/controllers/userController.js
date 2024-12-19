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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFollow = exports.updatePostWithBookmark = exports.getBookmarkedPosts = exports.updateUserPostById = exports.deleteUserPostById = exports.getUserPosts = exports.updateUserProfile = exports.getSecondaryUser = exports.getAllUsers = exports.getUserById = void 0;
const db_1 = require("../clients/db");
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req.user;
    try {
        const currentUser = yield db_1.prismaClient.user.findUnique({
            where: {
                id: user.id
            },
            include: {
                bookmarkedPosts: true,
                followers: true,
                followings: true
            }
        });
        res.status(200).json(currentUser);
    }
    catch (error) {
        res.status(500).json({ error: `error fetching user details for user ${user.firstName}, error: ${error}` });
    }
});
exports.getUserById = getUserById;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req.user;
    try {
        const allUser = yield db_1.prismaClient.user.findMany({
            where: {
                id: {
                    not: user.id
                },
            },
            include: {
                followers: true,
                followings: true
            }
        });
        res.status(200).json(allUser);
    }
    catch (error) {
        res.status(500).json({ error: `error fetching all user details , error: ${error}` });
    }
});
exports.getAllUsers = getAllUsers;
const getSecondaryUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const secondaryUser = yield db_1.prismaClient.user.findUnique({
            where: {
                id: userId
            },
            include: {
                posts: true,
                followers: true,
                followings: true
            }
        });
        res.status(200).json(secondaryUser);
    }
    catch (error) {
        res.status(500).json({ error: `error fetching user profile details, error: ${error}` });
    }
});
exports.getSecondaryUser = getSecondaryUser;
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req.user;
    const { profileImage, bio } = req.body;
    try {
        const udpatedUser = yield db_1.prismaClient.user.update({
            where: {
                id: user.id
            },
            data: {
                bio,
                profileImageURL: profileImage
            }
        });
        res.status(200).json(udpatedUser);
    }
    catch (error) {
        res.status(500).json({ error: `error updating user details for user ${user.firstName}, error: ${error}` });
    }
});
exports.updateUserProfile = updateUserProfile;
const getUserPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const userPosts = yield db_1.prismaClient.post.findMany({
            where: {
                authorId: userId
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
        res.status(200).json(userPosts);
    }
    catch (error) {
        res.status(500).json({ error: `error fetching posts details for user ${userId}, error: ${error}` });
    }
});
exports.getUserPosts = getUserPosts;
const deleteUserPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req.user;
    const postId = req.params.id;
    try {
        const deletedPost = yield db_1.prismaClient.post.delete({
            where: {
                id: postId
            },
        });
        res.status(200).json(deletedPost);
    }
    catch (error) {
        res.status(500).json({ error: `error delete post for user ${user.firstName}, error: ${error}` });
    }
});
exports.deleteUserPostById = deleteUserPostById;
const updateUserPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req.user;
    const postId = req.params.id;
    const { editedContent } = req.body;
    try {
        const updatedPost = yield db_1.prismaClient.post.update({
            where: {
                id: postId
            },
            data: {
                content: editedContent
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
        res.status(500).json({ error: `error update post for user ${user.firstName}, error: ${error}` });
    }
});
exports.updateUserPostById = updateUserPostById;
const getBookmarkedPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req.user;
    try {
        const userWithBookmarks = yield db_1.prismaClient.user.findUnique({
            where: { id: user.id },
            include: { bookmarkedPosts: {
                    include: {
                        author: true
                    }
                } },
        });
        res.status(200).json(userWithBookmarks);
    }
    catch (error) {
        res.status(500).json({ error: `error to get bookmarked posts for user ${user.firstName}, error: ${error}` });
    }
});
exports.getBookmarkedPosts = getBookmarkedPosts;
const updatePostWithBookmark = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req.user;
    const { postId, isBookmarked } = req.body;
    try {
        const updatedUserWithBookmark = yield db_1.prismaClient.user.update({
            where: {
                id: user.id
            },
            data: {
                bookmarkedPosts: isBookmarked === true ? { connect: { id: postId } } : { disconnect: { id: postId } }
            },
            include: { bookmarkedPosts: {
                    include: {
                        author: true
                    }
                } }
        });
        res.status(200).json(updatedUserWithBookmark);
    }
    catch (error) {
        res.status(500).json({ error: `error to get bookmarked posts for user ${user.firstName}, error: ${error}` });
    }
});
exports.updatePostWithBookmark = updatePostWithBookmark;
//  follows functionality
const updateFollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, to, follow } = req.body;
    try {
        if (follow) {
            yield db_1.prismaClient.follows.create({
                data: {
                    follower: { connect: { id: from } },
                    following: { connect: { id: to } }
                }
            });
        }
        else {
            yield db_1.prismaClient.follows.delete({
                where: { followerId_followingId: { followerId: from, followingId: to } }
            });
        }
        res.status(200).json({ message: "updated successfully" });
    }
    catch (error) {
        res.status(500).json({ error: `error to followUser ${error}` });
    }
});
exports.updateFollow = updateFollow;
