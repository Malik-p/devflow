import { Server } from "socket.io";

let io;

// 🔥 STORE ONLINE USERS
const onlineUsers = {};

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "https://YOUR_VERCEL_URL.vercel.app"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // 🔥 JOIN WORKSPACE
    socket.on("joinWorkspace", ({ workspaceId, userId }) => {
      socket.join(workspaceId);

      // 🔥 STORE USER
      if (!onlineUsers[workspaceId]) {
        onlineUsers[workspaceId] = [];
      }

      // 🔥 PREVENT DUPLICATES
      const alreadyExists = onlineUsers[workspaceId].includes(userId);

      if (!alreadyExists) {
        onlineUsers[workspaceId].push(userId);
      }

      // 🔥 SEND ONLINE USERS
      io.to(workspaceId).emit("onlineUsers", onlineUsers[workspaceId]);

      // 🔥 SAVE DATA
      socket.workspaceId = workspaceId;

      socket.userId = userId;

      console.log("Online users:", onlineUsers);
    });

    // 🔥 SEND MESSAGE
    socket.on("sendMessage", (messageData) => {
      io.to(messageData.workspaceId).emit("receiveMessage", messageData);
    });

    // 🔥 DISCONNECT
    socket.on("disconnect", () => {
      const { workspaceId, userId } = socket;

      if (workspaceId && onlineUsers[workspaceId]) {
        onlineUsers[workspaceId] = onlineUsers[workspaceId].filter(
          (id) => id !== userId,
        );

        io.to(workspaceId).emit("onlineUsers", onlineUsers[workspaceId]);
      }

      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
};
