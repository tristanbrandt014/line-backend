import { Request as ExpressRequest } from "express";
import { IAuthState, IContext } from "./";

export interface IRequest extends ExpressRequest {
  context: IContext;
  authentication: Promise<IAuthState>;
}
