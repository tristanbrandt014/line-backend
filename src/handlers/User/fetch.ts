import User, { IUserModel } from "./model";
import { ListQuery } from "list";
import { errors } from "../../utils/errors";
import { ObjectID } from "bson";

interface IFilters {
  onlyOthers?: boolean;
  ids?: string[] | ObjectID[];
}

export const fetch: ListQuery<IUserModel, IFilters> = async (args, context) => {
  const currentUser = await context.authenticate();
  if (!currentUser) {
    throw new Error(errors.UNAUTHENTICATED);
  }

  const query = User.find();

  if (args.filters.onlyOthers) {
    query.where("_id").ne(currentUser._id);
  }

  if (args.filters.ids) {
    query.where("_id").in(args.filters.ids);
  }

  const results = await query.exec();

  if (args.filters)
    return {
      total: results.length,
      results
    };
};
