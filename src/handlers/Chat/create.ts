import Chat, { IChatModel } from "./model";
import { IContext } from "context";
import { errors } from "../../utils/errors";
import { ObjectID } from "bson";
import { IMessage, IChat } from "chat";
import * as uuid from "uuid";

type createType = (
  args: {
    userId: string;
    message: string;
  },
  context: IContext
) => Promise<IChatModel>;

export const create: createType = async (args, context) => {
  const currentUser = await context.authenticate();
  if (!currentUser) {
    throw new Error(errors.UNAUTHENTICATED);
  }
  let userId: ObjectID;
  try {
    userId = new ObjectID(args.userId);
  } catch (e) {
    throw new Error(errors.INVALID_PARAMS);
  }
  if (args.userId === currentUser._id.toString()) {
    throw new Error(errors.NO_CHAT_SELF);
  }
  const existingChat = await Chat.findOne({
    users: {
      $all: [userId, currentUser._id]
    }
  });
  if (existingChat) {
    throw new Error(errors.EXISTING_CHAT);
  }

  const message: IMessage = {
    from: currentUser._id,
    read: false,
    content: args.message,
    uuid: uuid.v4()
  };

  const chat = {
    users: [currentUser._id, userId],
    messages: [message]
  };

  return Chat.create(chat);
};
