import { IUserModel } from "./model";
import User from "./model";
import { IUserWithToken, generateToken, expiresIn } from "./create";
import { errors } from "../../utils/errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

type Login = (
  args: { username: string; password: string }
) => Promise<IUserWithToken>;

export const login: Login = async args => {
  const user = await User.findOne({ username: args.username });
  if (!user) {
    throw new Error(errors.FAILED_TO_AUTHENTICATE);
  }

  const passwordsMatch = await bcrypt.compare(args.password, user.password);
  if (!passwordsMatch) {
    throw new Error(errors.FAILED_TO_AUTHENTICATE);
  }

  const token = generateToken(user._id.toString());

  return {
    user,
    token,
    expiresIn
  };
};

type DecodeToken = (token: string) => string;

export const decodeToken: DecodeToken = token => {
  const secret = process.env.AUTH_SECRET
    ? process.env.AUTH_SECRET
    : "super secret secret";

  let decoded: { id: string };
  try {
    decoded = jwt.verify(token, secret) as { id: string };
  } catch (e) {
    throw new Error(errors.FAILED_TO_DECODE_TOKEN);
  }

  return decoded.id;
};
