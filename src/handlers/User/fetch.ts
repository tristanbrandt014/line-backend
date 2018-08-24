import { IUser } from "user";
import User from "./model";

type FetchType = () => Promise<IUser[]>;

export const fetch: FetchType = async () => {
  return User.find();
};
