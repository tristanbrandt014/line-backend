import { Document, Schema, model } from "mongoose";
import { IUser } from "../../types";
import { collections } from "../../db";

export interface IUserModel extends IUser, Document {}

export const schema: Schema = new Schema(
  {
    username: String,
    display_name: String,
    password: String
  },
  { id: false, timestamps: true }
);

export default model<IUserModel>("User", schema, collections.User);
