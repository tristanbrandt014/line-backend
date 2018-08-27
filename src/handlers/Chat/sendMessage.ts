import { ObjectID } from "bson";
import { IContext } from "context";
import { IMessageModel } from "./model";
import { errors } from "../../utils/errors";
import { fetchOne } from "./fetchOne";
import { IMessage } from "chat";
import * as uuid from "uuid";
import { pubsub, topics } from "../../utils/pubsub";

type SendMessage = (
  args: {
    message: string;
    chatId: string | ObjectID;
  },
  context: IContext
) => Promise<IMessageModel>;

export const sendMessage: SendMessage = async (args, context) => {
  const currentUser = await context.authenticate();
  if (!currentUser) {
    throw new Error(errors.UNAUTHENTICATED);
  }
  const chat = await fetchOne({ conditions: { id: args.chatId } }, context);
  const newMessage: IMessage = {
    uuid: uuid.v4(),
    content: args.message,
    from: currentUser._id,
    read: false
  };

  // Not sure how to solve this. chat.messages expects IMessageModel
  // but mongoose creates it from IMessage
  // @ts-ignore
  chat.messages.push(newMessage);
  await chat.save();

  const savedMessage = chat.messages.find(
    message => message.uuid === newMessage.uuid
  );

  pubsub.publish(topics.NEW_MESSAGE, {
    [topics.NEW_MESSAGE]: {
      message: savedMessage,
      chatId: args.chatId
    }
  });

  return chat.messages.find(message => message.uuid === newMessage.uuid);
};
