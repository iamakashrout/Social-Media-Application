import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {fetch,markSeen,deleteNotif,addNotif} from "../controllers/notif/addNotifController.js";

const router = express.Router();

router.get("/view/:userEmail", fetch);
router.patch("/markSeen/:userEmail/:notifId", markSeen);
router.patch("/delete/:userEmail/:notifId",deleteNotif);
//verifyToken

//for testing on postman
router.post("/add",verifyToken,addNotif);

export default router;