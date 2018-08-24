import { NextFunction, Response } from "express";
import { IRequest, IAuthState } from "../types";
import { createContext } from "../utils/";
import { User } from "../handlers";
import UserModel from "../handlers/User/model";
import { IUserModel } from "../handlers/User/model";
import { errors } from "../utils/errors";

export const AuthMiddleware = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const validateAuthState = (authState: IAuthState) => {
    console.log(authState);
    if (authState.error) {
      throw new Error(errors.FAILED_TO_DECODE_TOKEN);
    } else if (authState.user) {
      return authState.user;
    }
  };

  const authenticate = async () => {
    if (req.authentication) {
      const authState = await req.authentication;
      return validateAuthState(authState);
    }
    req.authentication = (async () => {
      let error: string;
      let user: IUserModel;
      const token =
        req.body.token || req.query.token || req.headers["authorization"];
      if (!token) {
        return {
          error,
          user
        };
      }
      try {
        const id = User.decodeToken(token);
        const result = await UserModel.findById(id);
        if (!result) {
          error = "failed to decode";
        } else {
          user = result;
        }
      } catch (e) {
        error = e.message;
      }
      return {
        error,
        user
      };
    })();
    const authState = await req.authentication;
    return validateAuthState(authState);
  };

  req.context = createContext(authenticate);

  next();
};
