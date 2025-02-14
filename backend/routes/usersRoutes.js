import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  searchUser,
  editUserProfile
} from "../controllers/usersControllers.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.get("/search/:name", verifyToken, searchUser);

/*  Creating Edit Profile API */
router.get("/editUserProfile", verifyToken, editUserProfile);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;
