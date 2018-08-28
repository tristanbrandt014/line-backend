import { gql } from "../../utils";
import { errors } from "../../utils/errors";

export const Query = gql`
  extend type Query {
    getChats(offset: Int, first: Int, filters: ChatListFilters!): ChatList
    getChat(conditions: ChatConditions!): Chat
    searchChats(term: String!): [SearchResult]
  }

  input ChatListFilters {
    mine: Boolean
  }

  input ChatConditions {
    id: String
    userId: String
  }
`;

Query.getChats = async (root, params, context) =>
  context.handlers.Chat.fetch(params, context);

Query.getChat = async (root, params, context) =>
  context.handlers.Chat.fetchOne(params, context);

Query.searchChats = async (root, params, context) =>
  context.handlers.Chat.search(params, context);
