import { gql } from "../../utils";
import { errors } from "../../utils/errors";

export const Query = gql`
  extend type Query {
    getUsers(offset: Int, first: Int, filters: UserListFilters!): UserList
    getUser(conditions: UserConditions!): User
    getMe: User
  }

  input UserListFilters {
    onlyOthers: Boolean
    ids: [String]
  }

  input UserConditions {
    id: String!
  }
`;

Query.getUsers = (root, params, context) =>
  context.handlers.User.fetch(params, context);

Query.getMe = async (root, params, context) => {
  const currentUser = await context.authenticate();
  if (!currentUser) {
    throw new Error(errors.UNAUTHENTICATED);
  }
  return currentUser;
};

Query.getUser = (root, params, context) =>
  context.handlers.User.fetchOne(params, context);
