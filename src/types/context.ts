import * as handlers from "../handlers";
import { IUser } from "user";

export interface IContext {
  handlers: typeof handlers;
  authenticate: () => Promise<IUser | void>;
}
