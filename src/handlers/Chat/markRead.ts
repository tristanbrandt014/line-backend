import { IContext } from "context";
import { fetchOne } from "./fetchOne";
import { errors } from "../../utils/errors";

type MarkRead = (
  args: { chatId: string },
  context: IContext
) => Promise<boolean>;

export const markRead: MarkRead = async (args, context) => {
  const chat = await fetchOne({ conditions: { id: args.chatId } }, context);
  const currentUser = await context.authenticate();
  if (!currentUser) {
    throw new Error(errors.UNAUTHENTICATED);
  }
  chat.messages.forEach(message => {
    if (!message.from.equals(currentUser._id)) {
      message.read = true;
    }
  });
  await chat.save();
  return true;
};
