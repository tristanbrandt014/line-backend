import { IUserModel } from "../handlers/User/model";

export type IAuthState = {
  user?: IUserModel | null;
  error?: string;
};
