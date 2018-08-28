import Chat, { IChatModel } from "./model";
import { ListQuery } from "list";
import { errors } from "../../utils/errors";
import { ObjectID } from "bson";
import { IChat } from "chat";

interface IFilters {
  mine?: boolean;
}

export const fetch: ListQuery<IChatModel, IFilters> = async (args, context) => {
  const currentUser = await context.authenticate();
  if (!currentUser) {
    throw new Error(errors.UNAUTHENTICATED);
  }
  if (!args.filters.mine) {
    throw new Error(errors.UNAUTHORISED);
  }

  const query = Chat.find();

  if (args.filters.mine) {
    query.where("users").equals(currentUser._id);
  }

  const results = await query.exec();

  return {
    total: results.length,
    results
  };
};
