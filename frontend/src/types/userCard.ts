interface User {
  userId: string;
  distance?: string | number;
  eta?: string | number;
}

export interface UserCardProps {
  user: User;
}
