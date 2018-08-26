import User, { IUserModel } from "./model";
import { IContext } from "context";
import { errors } from "../../utils/errors";
import { ObjectID } from "bson";

interface IConditions {
  id: string | ObjectID;
}

type fetchOneType = (
  args: { conditions: IConditions },
  context: IContext
) => Promise<IUserModel>;

export const fetchOne: fetchOneType = async (args, context) => {
  const currentUser = await context.authenticate();
  if (!currentUser) {
    throw new Error(errors.UNAUTHENTICATED);
  }
  const user = await User.findOne({
    _id: args.conditions.id
  });

  if (!user) {
    throw new Error(errors.NOT_FOUND);
  }

  return user;
};
