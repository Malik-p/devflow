import Message from "../models/message.model.js";

// 🔥 GET WORKSPACE MESSAGES
export const getMessages = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const messages = await Message.find({
      workspaceId,
    })
      .populate("sender", "name email")
      .sort({
        createdAt: 1,
      });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// 🔥 SAVE MESSAGE
export const saveMessage = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const { text } = req.body;

    const message = await Message.create({
      workspaceId,
      sender: req.user.id,
      text,
    });

    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "name email",
    );

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
