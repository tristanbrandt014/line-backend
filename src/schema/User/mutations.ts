import { gql } from "../../utils";

export const Mutation = gql`
  extend type Mutation {
    createUser(
      username: String!
      displayName: String
      password: String!
    ): UserWithToken
    loginUser(username: String!, password: String!): UserWithToken
  }
`;

Mutation.createUser = (
  root,
  params: { username: string; displayName?: string; password: string },
  context
) => context.handlers.User.create(params);

Mutation.loginUser = (
  root,
  params: { username: string; password: string },
  context
) => context.handlers.User.login(params);
