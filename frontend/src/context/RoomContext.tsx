import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import type { User } from "../types/User";
import socket from "../socket";
import type { RoomContextType } from "../types/RoomContextType";

const RoomContext = createContext<RoomContextType | null>(null);

export function RoomProvider({ children }: { children: ReactNode }) {
  const getInitialRoomId = () => {
    const pathMatch = window.location.pathname.match(/room\/([^/]+)/);
    if (pathMatch) return pathMatch[1];
    return new URLSearchParams(window.location.search).get("roomId");
  };

  const [roomId, setRoomId] = useState<string | null>(getInitialRoomId());
  const [roomInput, setRoomInput] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [route, setRoute] = useState<any>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);

  const usersWithMe = useMemo(() => {
    return users.map((u) => ({
      ...u,
      isMe: u.userId === socket.id,
    }));
  }, [users, socket.id]);

  return (
    <RoomContext.Provider
      value={{
        roomId,
        setRoomId,
        roomInput,
        setRoomInput,
        users,
        setUsers,
        selectedUser,
        setSelectedUser,
        route,
        setRoute,
        loadingRoute,
        setLoadingRoute,
        usersWithMe,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) throw new Error("useRoom must be used within a RoomProvider");
  return context;
};
