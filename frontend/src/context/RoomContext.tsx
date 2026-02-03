import { createContext, useContext, useState, type ReactNode } from "react";

interface RoomContextType {
  roomId: string | null;
  setRoomId: (id: string) => void;
  roomInput: string;
  setRoomInput: (input: string) => void;
}

const getRoomId = () => {
  const match = window.location.pathname.match(/room\/([^/]+)/);
  return match ? match[1] : null;
};

const RoomContext = createContext<RoomContextType | null>(null);

export function RoomProvider({ children }: { children: ReactNode }) {
  const [roomId, setRoomId] = useState<string | null>(getRoomId());
  const [roomInput, setRoomInput] = useState<string>("");
  const value = {
    roomId,
    setRoomId,
    roomInput,
    setRoomInput,
  };

  return <RoomContext value={value}>{children}</RoomContext>;
}

export function useRoom() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
}
