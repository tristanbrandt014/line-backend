import { gql } from "../../utils";
import { withFilter } from "graphql-subscriptions";
import { pubsub, topics } from "../../utils/pubsub";
import { decodeToken } from "../../handlers/User";
import User from "../../handlers/User/model";
import Chat from "../../handlers/Chat/model";

export const Subscription = gql`
  extend type Subscription {
    newMessage(token: String!): NewMessagePayload
    newChat(token: String!): Chat
  }

  type NewMessagePayload {
    message: Message
    chatId: String
  }
`;

Subscription.newMessage = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(topics.NEW_MESSAGE),
    async (payload, variables) => {
      try {
        const id = decodeToken(variables.token);

        const user = await User.findById(id);
        if (!user) {
          return false;
        }

        const chat = await Chat.findOne({
          _id: payload.newMessage.chatId,
          users: user._id
        });
        if (chat) {
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    }
  )
};

Subscription.newChat = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(topics.NEW_CHAT),
    async (payload, variables) => {
      try {
        const id = decodeToken(variables.token);

        const user = await User.findById(id);
        if (!user) {
          return false;
        }
        console.log(payload.newChat);
        const chat = await Chat.findOne({
          _id: payload.newChat._id,
          users: user._id
        });
        if (chat) {
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    }
  )
};
