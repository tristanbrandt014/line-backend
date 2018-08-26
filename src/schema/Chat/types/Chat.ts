import { gql } from "../../../utils";
import { IChatModel } from "../../../handlers/Chat/model";

export const Chat = gql`
  type Chat {
    id: String
    users: [User]
    messages: [Message]
  }
`;

Chat.id = (root: IChatModel, params, context) => root._id;

Chat.users = async (root: IChatModel, params, context) => {
  const query = await context.handlers.User.fetch(
    { filters: { ids: root.users } },
    context
  );
  return query.results;
};
