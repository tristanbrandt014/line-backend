import { gql } from "../../../utils";
import { IChatModel } from "../../../handlers/Chat/model";
import { errors } from "../../../utils/errors";

export const Chat = gql`
  type Chat {
    id: String
    users: [User]
    messages: [Message]
    other: User
  }
`;

Chat.id = (root: IChatModel, params, context) => root._id;

// NB this is does not respect order of users
Chat.users = async (root: IChatModel, params, context) => {
  const query = await context.handlers.User.fetch(
    { filters: { ids: root.users } },
    context
  );
  return query.results;
};

Chat.other = async (root: IChatModel, params, context) => {
  const currentUser = await context.authenticate();
  if (!currentUser) {
    throw new Error(errors.UNAUTHENTICATED);
  }
  const filtered = root.users.filter(
    user_id => !user_id.equals(currentUser._id)
  );

  if (!filtered.length || filtered.length === root.users.length) {
    return undefined;
  }

  return context.handlers.User.fetchOne(
    { conditions: { id: filtered[0] } },
    context
  );
};
