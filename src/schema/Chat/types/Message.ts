import { gql } from "../../../utils";
import { IMessageModel } from "../../../handlers/Chat/model";

export const Message = gql`
  type Message {
    id: String
    from: User
    content: String
    read: Boolean
  }
`;

Message.id = (root: IMessageModel, params, context) => root._id;

Message.from = (root: IMessageModel, params, context) =>
  context.handlers.User.fetchOne({ conditions: { id: root.from } }, context);
