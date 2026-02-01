import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connectDB } from "./config/db";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { Request, Response } from "express";
import { handleSocketConnection } from "./socket/handlers/socketHandlers";
const PORT = process.env.PORT || 5000;
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
// socket connection
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  handleSocketConnection(io, socket);
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// test route
app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Hello from Server </h1>");
});

connectDB();

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
