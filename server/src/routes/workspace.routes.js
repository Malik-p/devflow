import express from "express";
import {
  addMember,
  createWorkspace,
  getMyWorkspace,
  getWorkspace,
} from "../controllers/workspace.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { getTasks } from "../controllers/task.controller.js";

const router = express.Router();

router.post("/create", protect, createWorkspace);
router.post("/:workspaceId/add-member", protect, addMember);
router.get("/my-workspace", protect, getMyWorkspace);
router.get("/:workspaceId", protect, getWorkspace);

export default router;
