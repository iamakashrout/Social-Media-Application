import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { createStory, fetchStories, viewStory, likeStory, getOwnStories } from "../controllers/storyController.js";

const router = express.Router();

router.post("/create", verifyToken, createStory);
router.get("/fetch", verifyToken, fetchStories);
router.patch("/view", verifyToken, viewStory);
router.patch("/like", verifyToken, likeStory);
router.get("/own-stories", verifyToken, getOwnStories);

export default router;