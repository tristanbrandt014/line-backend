import { gql } from "../../utils";

export const Mutation = gql`
  extend type Mutation {
    createChat(userId: String!, message: String!): Chat
  }
`;

Mutation.createChat = (
  root,
  params: { userId: string; message: string },
  context
) => context.handlers.Chat.create(params, context);
