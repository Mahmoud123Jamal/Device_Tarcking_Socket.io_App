import type { User } from "./User";

export interface MapContentProps {
  users: User[];
  mySocketId: string;
  route?: any;
  selectedUser?: User | null;
  selectedUserId?: string | null;
}
