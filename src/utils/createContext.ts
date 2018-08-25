import * as handlers from "./../handlers";
import { IContext } from "../types";
import { IUserModel } from "../handlers/User/model";

export const createContext = (
  authenticate: () => Promise<IUserModel | void>
): IContext => {
  return {
    handlers,
    authenticate
  };
};
