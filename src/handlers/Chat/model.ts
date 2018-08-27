import { Document, Schema, model } from "mongoose";
import { IChat, IMessage } from "../../types";
import { collections } from "../../db";

export interface IMessageModel extends IMessage, Document {}

export const messageSchema: Schema = new Schema(
  {
    from: Schema.Types.ObjectId,
    content: String,
    read: Boolean,
    uuid: String
  },
  { id: false, timestamps: true }
);

export interface IChatModel extends IChat, Document {
  messages: IMessageModel[];
}

export const schema: Schema = new Schema(
  {
    users: [Schema.Types.ObjectId],
    messages: [messageSchema]
  },
  { id: false, timestamps: true }
);

export default model<IChatModel>("Chat", schema, collections.Chat);
