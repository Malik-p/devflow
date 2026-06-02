import Task from "../models/task.model.js";
import Workspace from "../models/workspace.model.js";
import Project from "../models/project.model.js";
import mongoose from "mongoose";

// ✅ CREATE TASK
export const createTask = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const { title, description, projectId, assignedTo, priority, deadline } =
      req.body;

    // 🔥 FIND WORKSPACE
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    // 🔥 FIND CURRENT MEMBER
    const member = workspace.members.find(
      (m) => m.userId.toString() === req.user.id,
    );

    if (!member) {
      return res.status(403).json({
        message: "Not a workspace member",
      });
    }

    // 🔥 ONLY ADMIN / OWNER CAN CREATE TASK
    if (member.role !== "owner" && member.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can create tasks",
      });
    }

    // 🔥 VALIDATE PROJECT
    const project = await Project.findOne({
      _id: projectId,
      workspaceId,
    });

    if (!project) {
      return res.status(400).json({
        message: "Invalid project",
      });
    }

    // 🔥 VALIDATE ASSIGNED USER
    if (assignedTo) {
      const isMember = workspace.members.some(
        (m) => m.userId.toString() === assignedTo,
      );

      if (!isMember) {
        return res.status(400).json({
          message: "Assigned user is not part of workspace",
        });
      }
    }

    // 🔥 CREATE TASK
    const task = await Task.create({
      title,
      description,
      projectId,
      workspaceId,
      assignedTo,
      priority,
      deadline,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Task created",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ GET TASKS
export const getTasks = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const { status, priority } = req.query;

    // 🔥 FIND WORKSPACE
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    // 🔥 FIND CURRENT MEMBER
    const member = workspace.members.find(
      (m) => m.userId.toString() === req.user.id,
    );

    if (!member) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    // 🔥 BASE QUERY
    const query = {
      workspaceId,
    };

    // 🔥 MEMBERS SEE ONLY THEIR TASKS
    if (member.role === "member") {
      query.assignedTo = req.user.id;
    }

    // 🔥 OPTIONAL FILTERS
    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    // 🔥 FETCH TASKS
    const tasks = await Task.find(query)
      .populate("assignedTo", "name email")
      .populate("projectId", "name")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ DASHBOARD STATS
export const getDashboardStats = async (req, res) => {
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

    // 🔥 MEMBERS SEE ONLY THEIR STATS
    const matchQuery =
      member.role === "member"
        ? {
            workspaceId: new mongoose.Types.ObjectId(workspaceId),
            assignedTo: new mongoose.Types.ObjectId(req.user.id),
          }
        : {
            workspaceId: new mongoose.Types.ObjectId(workspaceId),
          };

    const totalTasks = await Task.countDocuments(matchQuery);

    const statusStats = await Task.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const priorityStats = await Task.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const userStats = await Task.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$assignedTo",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          name: "$user.name",
          email: "$user.email",
          count: 1,
        },
      },
    ]);

    res.json({
      totalTasks,
      statusStats,
      priorityStats,
      userStats,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ UPDATE TASK STATUS
export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const workspace = await Workspace.findById(task.workspaceId);

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

    // 🔥 MEMBER CAN UPDATE ONLY OWN TASK
    if (
      member.role === "member" &&
      task.assignedTo?.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "You can update only your assigned tasks",
      });
    }

    task.status = status;

    await task.save();

    res.json({
      message: "Task updated",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
