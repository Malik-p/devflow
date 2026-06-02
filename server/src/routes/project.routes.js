import express from "express";
import { protect } from "../middlewares/auth.middleware.js";

import {
  createProject,
  getProjects,
} from "../controllers/project.controller.js";

const router = express.Router();

// ✅ CREATE PROJECT
router.post("/:workspaceId", protect, createProject);

// ✅ GET PROJECTS
router.get("/:workspaceId", protect, getProjects);

export default router;
