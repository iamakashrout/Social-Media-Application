import express from "express";
import getResponse from "../controllers/gemini/geminiController.js";

const router = express.Router();

router.post("/gemini", getResponse);

export default router;