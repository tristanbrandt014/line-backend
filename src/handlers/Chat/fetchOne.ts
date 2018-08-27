import Chat, { IChatModel } from "./model";
import { IContext } from "context";
import { errors } from "../../utils/errors";
import { ObjectID } from "bson";

interface IConditions {
  id?: string | ObjectID;
  userId?: string | ObjectID;
}

type fetchOneType = (
  args: { conditions: IConditions },
  context: IContext
) => Promise<IChatModel>;

export const fetchOne: fetchOneType = async (args, context) => {
  const currentUser = await context.authenticate();
  if (!currentUser) {
    throw new Error(errors.UNAUTHENTICATED);
  }
  if (!args.conditions.id && !args.conditions.userId) {
    throw new Error(errors.INVALID_PARAMS);
  }

  let chat: IChatModel;

  if (args.conditions.id) {
    chat = await Chat.findOne({
      _id: args.conditions.id,
      users: currentUser._id
    });
  } else if (args.conditions.userId) {
    if (typeof args.conditions.userId === "string") {
      if (args.conditions.userId === currentUser._id.toString()) {
        throw new Error(errors.INVALID_PARAMS);
      }
    } else {
      if (args.conditions.userId.equals(currentUser._id)) {
        throw new Error(errors.INVALID_PARAMS);
      }
    }
    chat = await Chat.findOne({
      users: {
        $all: [args.conditions.userId, currentUser._id]
      }
    });
  }

  if (!chat) {
    throw new Error(errors.NOT_FOUND);
  }

  return chat;
};
