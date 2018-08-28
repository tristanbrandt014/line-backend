import { gql } from "../../utils";

export const Mutation = gql`
  extend type Mutation {
    createChat(userId: String!, message: String!): Chat
    sendMessage(message: String!, chatId: String!): Message
    markRead(chatId: String!): Boolean
  }
`;

Mutation.createChat = (
  root,
  params: { userId: string; message: string },
  context
) => context.handlers.Chat.create(params, context);

Mutation.sendMessage = (root, params, context) =>
  context.handlers.Chat.sendMessage(params, context);

Mutation.markRead = (root, params, context) =>
  context.handlers.Chat.markRead(params, context);
