import express from "express";

import { protect } from "../middlewares/auth.middleware.js";

import {
  createTask,
  getDashboardStats,
  getTasks,
  updateTaskStatus,
} from "../controllers/task.controller.js";

const router = express.Router();

// ✅ CREATE TASK
router.post("/:workspaceId", protect, createTask);

// ✅ GET TASKS
router.get("/:workspaceId", protect, getTasks);

// ✅ DASHBOARD STATS
router.get("/:workspaceId/stats", protect, getDashboardStats);

// ✅ UPDATE TASK STATUS
router.put("/:taskId/status", protect, updateTaskStatus);

export default router;
