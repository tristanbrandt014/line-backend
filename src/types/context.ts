import * as handlers from "../handlers";
import { IUserModel } from "../handlers/User/model";

export interface IContext {
  handlers: typeof handlers;
  authenticate: () => Promise<IUserModel | void>;
}
