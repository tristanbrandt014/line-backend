import { IUserModel } from "./model";
import User from "./model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_WORK_FACTOR = 10;

// In seconds (14 days)
export const expiresIn = 14 * 24 * 60 * 60;

export interface IUserWithToken {
  user: IUserModel;
  token: string;
  expiresIn: number;
}

type createType = (
  args: {
    username: string;
    displayName?: string;
    password: string;
  }
) => Promise<IUserWithToken>;

export const create: createType = async args => {
  const passwordErrors = getPasswordErrors(args.password);
  if (passwordErrors.length) {
    throw new Error(passwordErrors.join("\n"));
  }

  const [usernameExists, password] = await Promise.all([
    checkUsernameExists(args.username),
    generatePassword(args.password)
  ]);

  if (usernameExists) {
    throw new Error("Username already exists");
  }

  const displayName = args.displayName ? args.displayName : args.username;

  const user = await User.create({
    username: args.username,
    display_name: displayName,
    password
  });

  const token = generateToken(user._id.toString());

  return {
    user,
    token,
    expiresIn
  };
};

// Utils

type CheckUsernameExists = (username: string) => Promise<boolean>;

const checkUsernameExists: CheckUsernameExists = async username => {
  const result = await User.findOne({
    username
  });

  // Cheeky cast to boolean
  return !!result;
};

type GetPasswordErrors = (password: string) => string[];

const getPasswordErrors: GetPasswordErrors = password => {
  const minLength = 6;
  const requireUpper = true;
  const requireLower = true;
  const requireNumber = true;

  const errors = [];

  if (password.length < minLength) {
    errors.push(`The password must be at least ${minLength} characters.`);
  }

  if (requireLower) {
    if (!/[a-z]/.test(password)) {
      errors.push("The password must contain at least one lowercase letter.");
    }
  }

  if (requireUpper) {
    if (!/[A-Z]/.test(password)) {
      errors.push("The password must contain at least one uppercase letter.");
    }
  }

  if (requireNumber) {
    if (!/[0-9]/.test(password)) {
      errors.push("The password must contain at least one number.");
    }
  }

  return errors;
};

type GeneratePassword = (password: string) => Promise<string>;

const generatePassword: GeneratePassword = async (password: string) => {
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  return bcrypt.hash(password, salt);
};

type GenerateToken = (id: string) => string;

export const generateToken: GenerateToken = id => {
  const secret = process.env.AUTH_SECRET
    ? process.env.AUTH_SECRET
    : "super secret secret";

  return jwt.sign({ id }, secret, {
    expiresIn: `${expiresIn}s`
  });
};
