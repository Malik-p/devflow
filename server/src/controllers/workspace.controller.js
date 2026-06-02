import Workspace from "../models/workspace.model.js";
import User from "../models/user.model.js";

export const createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;

    const workspace = await Workspace.create({
      name,
      createdBy: req.user.id,
      members: [
        {
          userId: req.user.id,
          role: "owner",
        },
      ],
    });
    res.status(201).json({
      message: "Workspace created",
      workspace,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const { email, role } = req.body;

    const workspace = await Workspace.findById(workspaceId).populate(
      "members.userId",
      "name email",
    );

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    // 🔥 CHECK CURRENT USER
    const currentUser = workspace.members.find(
      (m) =>
        m.userId && m.userId._id && m.userId._id.toString() === req.user.id,
    );

    if (
      !currentUser ||
      (currentUser.role !== "owner" && currentUser.role !== "admin")
    ) {
      return res.status(403).json({
        message: "Not Authorized",
      });
    }

    // 🔥 FIND USER BY EMAIL
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 🔥 CHECK IF ALREADY MEMBER
    const alreadyMember = workspace.members.find(
      (m) =>
        m.userId &&
        m.userId._id &&
        m.userId._id.toString() === user._id.toString(),
    );

    if (alreadyMember) {
      return res.status(400).json({
        message: "User already in workspace",
      });
    }

    // 🔥 ADD MEMBER
    workspace.members.push({
      userId: user._id,
      role,
    });

    await workspace.save();

    res.status(200).json({
      message: "Member added",
      workspace,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// 🔥 GET LOGGED IN USER WORKSPACE
export const getMyWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({
      "members.userId": req.user.id,
    }).populate("members.userId", "name email");

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    res.status(200).json({
      _id: workspace._id,
      name: workspace.name,
      members: workspace.members,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// 🔥 GET WORKSPACE BY ID
export const getWorkspace = async (
  req,
  res
) => {
  try {

    const { workspaceId } = req.params;

    const workspace =
      await Workspace.findById(
        workspaceId
      ).populate(
        "members.userId",
        "name email"
      );

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    res.status(200).json({
      members: workspace.members,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};
