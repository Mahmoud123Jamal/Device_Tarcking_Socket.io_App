import { io, Socket } from "socket.io-client";
import type { User } from "./types/User";

const URL = (import.meta.env.VITE_URL as string) || "http://localhost:3001";

const socket: Socket = io(URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  transports: ["websocket"],
});

export const joinRoom = (roomId: string) => {
  socket.emit("joinRoom", roomId);
};

export const sendLocationUpdate = (locationData: {
  latitude: number;
  longitude: number;
}) => {
  socket.emit("locationUpdate", locationData);
};

export const listenforLocationUpdate = (callback: (data: User[]) => void) => {
  socket.off("locationUpdate");

  socket.on("locationUpdate", (data: any[]) => {
    const formattedUsers: User[] = data.map((u) => ({
      userId: u.id || u.userId,
      lat: u.latitude,
      lng: u.longitude,
      distance: u.distance,
      eta: u.duration,
      isMe: (u.id || u.userId) === socket.id,
    }));
    callback(formattedUsers);
  });
};

export const listenForUserLeft = (callback: (socketId: string) => void) => {
  socket.off("userLeft");
  socket.on("userLeft", (data) => {
    callback(data.socketId || data);
  });
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
