import { io } from "socket.io-client";

const URL = (import.meta.env.URL as string) || "http://localhost:3001";

const socket = io(URL);

export const joinRoom = (roomId: string) => {
  socket.emit("joinRoom", roomId);
};

export const sendLocationUpdate = (locationData: {
  latitude: number;
  longitude: number;
}) => {
  socket.emit("locationUpdate", locationData);
};
export const listenforLocationUpdate = (
  callback: (locationData: { latitude: number; longitude: number }) => void,
) => {
  socket.on("userLeft", callback);
};
export const disconnectSocket = () => {
  socket.disconnect();
};

export default socket;
