import { gql } from "../../../utils";
import { IUserModel } from "../../../handlers/User/model";

export const User = gql`
  type User {
    id: String
    username: String
    displayName: String
    myChat: Chat
  }
`;

User.id = (root: IUserModel, params, context) => root._id;

User.displayName = (root: IUserModel, params, context) => root.display_name;

User.myChat = async (root: IUserModel, params, context) => {
  try {
    const chat = await context.handlers.Chat.fetchOne(
      { conditions: { userId: root._id } },
      context
    );
    return chat;
  } catch (e) {
    return undefined;
  }
};
