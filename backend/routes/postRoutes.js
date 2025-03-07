import express from "express";
import { getFeedPosts, getUserPosts, likePost, commentPost,deleteComment,editComment,likeComment } from "../controllers/postControllers.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ POST */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE POSTS */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/comment", verifyToken, commentPost);
router.patch("/:id/like/:commentId", verifyToken, likeComment);
router.patch("/:id/delete/:commentId", verifyToken, deleteComment);
router.patch("/:id/edit/:commentId", verifyToken, editComment);



export default router;