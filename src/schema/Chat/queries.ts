import { gql } from "../../utils";
import { errors } from "../../utils/errors";

export const Query = gql`
  extend type Query {
    getChat: String
  }
`;

Query.getChat = async (root, params, context) => {
  const user = await context.authenticate();
  console.log(user);
  if (!user) {
    throw new Error(errors.UNAUTHENTICATED);
  }
  return "Hello";
};
