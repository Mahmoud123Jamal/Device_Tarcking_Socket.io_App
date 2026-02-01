import { ParticipantData } from "./ParticipantDataType";

export interface UserRooms {
  [roomId: string]: {
    [socketId: string]: ParticipantData;
  };
}
