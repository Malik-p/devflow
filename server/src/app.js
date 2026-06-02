import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import { protect } from "./middlewares/auth.middleware.js";
import workspaceRoutes from "./routes/workspace.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import messageRoutes from "./routes/message.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("DevFlow API running....");
});

app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});

app.use("/api/auth", authRoutes);
app.use("/api/workspace", workspaceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/messages", messageRoutes);

export default app;
