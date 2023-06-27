import express from "express";
import { getFeedPosts, getUserPosts, likePost, commentPost } from "../controllers/postControllers.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ POST */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE POSTS */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/comment", verifyToken, commentPost);

export default router;