import type { User } from "./User";

export interface RoomContextType {
  roomId: string | null;
  setRoomId: (id: string | null) => void;
  roomInput: string;
  setRoomInput: (input: string) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  route: any;
  setRoute: (route: any) => void;
  loadingRoute: boolean;
  setLoadingRoute: (loading: boolean) => void;
  usersWithMe: User[];
}
