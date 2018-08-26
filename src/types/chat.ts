import { ObjectID } from "bson";

export interface IChat {
  users: ObjectID[];
  messages: IMessage[];
}

export interface IMessage {
  from: ObjectID;
  content: string;
  read: boolean;
}
