import type { User } from "./User";

export interface SidebarProps {
  users: User[];
  onSelectUser: (user: User) => void;
  selectedUserId: string | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  windowWidth: number;
}
