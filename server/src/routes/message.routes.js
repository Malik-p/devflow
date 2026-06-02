import express from "express";

import { getMessages, saveMessage } from "../controllers/message.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🔥 GET CHAT HISTORY
router.get("/:workspaceId", protect, getMessages);

// 🔥 SAVE MESSAGE
router.post("/:workspaceId", protect, saveMessage);

export default router;
