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
  socket.on("joinRoom", (roomId: string) => {
    if (!roomId || roomId === "null") return;

    socket.join(roomId);
    socket.roomId = roomId;

    if (!userRooms[roomId]) {
      userRooms[roomId] = {};
    }

    userRooms[roomId][socket.id] = {
      joinedAt: new Date(),
      location: undefined,
    };
  });

  socket.on(
    "locationUpdate",
    async (locationData: { latitude: number; longitude: number }) => {
      const roomId = socket.roomId;
      if (!roomId || !userRooms[roomId]) return;

      if (userRooms[roomId][socket.id]) {
        userRooms[roomId][socket.id].location = {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        };
      }

      const users = userRooms[roomId];
      const currentUserData = users[socket.id];

      const updateUser = await Promise.all(
        Object.keys(users).map(async (id) => {
          let distance = null;
          let duration = null;

          const targetUser = users[id];

          if (
            id !== socket.id &&
            currentUserData?.location &&
            targetUser?.location
          ) {
            try {
              const res = await calculateDistanceAndEta(
                targetUser,
                currentUserData,
              );
              distance = res.distance;
              duration = res.duration;
            } catch (err) {
              console.error("Calculation error:", err);
            }
          }

          return {
            id,
            joinedAt: targetUser?.joinedAt,
            latitude: targetUser?.location?.latitude || null,
            longitude: targetUser?.location?.longitude || null,
            distance,
            duration,
          };
        }),
      );

      io.to(roomId).emit("locationUpdate", updateUser);
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
  });
};
