import { Server, Socket } from "socket.io";
import { UserRooms } from "../../types/UserRoomsType";
import { calculateDistanceAndEta } from "../../controllers/locationsController";

declare module "socket.io" {
  interface Socket {
    roomId?: string;
  }
}

let userRooms: UserRooms = {};

export const handleSocketConnection = (io: Server, socket: Socket): void => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", (roomId: string) => {
    socket.join(roomId);
    socket.roomId = roomId;

    if (!userRooms[roomId]) {
      userRooms[roomId] = {};
    }

    userRooms[roomId][socket.id] = {
      joinedAt: new Date(),
    };

    console.log(`User ${socket.id} added to room ${roomId}`);
  });

  socket.on(
    "locationUpdate",
    async (locationData: { latitude: number; longitude: number }) => {
      const roomId = socket.roomId;
      if (!roomId) return;
      const userData = userRooms[roomId]?.[socket.id];
      if (userData) {
        userData.location = {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        };

        socket.to(roomId).emit("userMoved", {
          socketId: socket.id,
          location: userData.location,
        });
      }
      // calculate distance for all users in the room
      const users = userRooms[roomId];
      const updateUser = await Promise.all(
        Object.keys(users).map(async (id) => {
          let distance = null;
          let duration = null;

          if (users[socket.id] && users[id] && id !== socket.id) {
            try {
              const res = await calculateDistanceAndEta(
                users[id],
                users[socket.id],
              );

              distance = res.distance;
              duration = res.duration;
            } catch (err) {
              console.error("Error calculating distance:", err);
              distance = "N/A";
              duration = "N/A";
            }
          }

          return {
            id,
            ...users[id],
            latitude: users[id].location?.latitude || null,
            longitude: users[id].location?.longitude || null,
            distance,
            duration,
          };
        }),
      );
      io.to(roomId).emit("locationUpdate", updateUser); // user offline handling
    },
  );

  socket.on("disconnect", () => {
    const roomId = socket.roomId;

    if (roomId && userRooms[roomId]) {
      delete userRooms[roomId][socket.id];

      socket.to(roomId).emit("userLeft", { socketId: socket.id });

      if (Object.keys(userRooms[roomId]).length === 0) {
        delete userRooms[roomId];
      }
    }
    console.log("User disconnected and tracking cleaned up");
  });
};
