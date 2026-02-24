export interface User {
  userId: string;
  isMe: boolean;
  lat?: number;
  lng?: number;
  distance?: string;
  eta?: string;
  [key: string]: any;
}
