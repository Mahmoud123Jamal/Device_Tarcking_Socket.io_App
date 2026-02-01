export interface ParticipantData {
  location?: {
    latitude: number;
    longitude: number;
  };
  joinedAt?: Date;
  [key: string]: any;
}
