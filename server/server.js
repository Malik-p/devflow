import app from "./src/app.js";

import connectDB from "./src/config/db.js";

import dotenv from "dotenv";

import http from "http";

import { initSocket } from "./src/socket/socket.js";

dotenv.config();

connectDB();

// 🔥 CREATE HTTP SERVER
const server = http.createServer(app);

// 🔥 INIT SOCKET
initSocket(server);

const PORT = process.env.PORT || 5000;

// 🔥 START SERVER
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
