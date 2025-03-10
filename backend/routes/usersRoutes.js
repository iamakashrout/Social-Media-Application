import express from "express";
import multer from "multer";
import { updateUserProfile } from "../controllers/usersControllers.js";

import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  searchUser,
} from "../controllers/usersControllers.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.get("/search/:name", verifyToken, searchUser);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
const upload = multer({ storage: multer.memoryStorage() });

// **Update User Profile Route**
router.put("/users-profile/:id", updateUserProfile);

export default router;
