import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connectDB } from "./config/db";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { Request, Response } from "express";
const PORT = process.env.PORT || 5000;
const server = createServer(app);

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user connected");
});

// test route
app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Hello from Server </h1>");
});

connectDB();

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
