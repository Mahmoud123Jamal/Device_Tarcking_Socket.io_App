import { io } from "socket.io-client";

const URL = "http://localhost:3001";

const socket = io(URL);

export const joinRoom = (roomId: string) => {
  socket.emit("joinRoom", roomId);
};
