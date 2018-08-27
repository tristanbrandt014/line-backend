import { ObjectID } from "bson";

export interface IChat {
  users: ObjectID[];
}

export interface IMessage {
  from: ObjectID;
  content: string;
  read: boolean;
  uuid: string;
}
