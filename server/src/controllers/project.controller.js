import Project from "../models/project.model.js";
import Workspace from "../models/workspace.model.js";

export const createProject = async (req, res) => {
  try {
    const { name } = req.body;
    const { workspaceId } = req.params;

    // 🔥 Find workspace
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    // 🔥 Find current member
    const member = workspace.members.find(
      (m) => m.userId.toString() === req.user.id,
    );

    if (!member) {
      return res.status(403).json({
        message: "Not a workspace member",
      });
    }

    // 🔥 RBAC CHECK
    if (member.role !== "owner" && member.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can create projects",
      });
    }

    // 🔥 Create project
    const project = await Project.create({
      name,
      workspaceId,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Project created",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const member = workspace.members.find(
      (m) => m.userId.toString() === req.user.id,
    );

    if (!member) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const projects = await Project.find({
      workspaceId,
    }).sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
