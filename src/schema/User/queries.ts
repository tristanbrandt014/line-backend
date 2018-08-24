import { gql } from "../../utils";

export const Query = gql`
  extend type Query {
    getUsers: [User]
  }
`;

Query.getUsers = (root, params, context) => context.handlers.User.fetch();
