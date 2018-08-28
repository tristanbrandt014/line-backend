import { gql } from "../../../utils";
import { IMessageModel } from "../../../handlers/Chat/model";
import { ObjectID, ObjectId } from "bson";

export const Message = gql`
  type Message {
    id: String
    from: User
    content: String
    read: Boolean
    timestamp: Int
  }
`;

Message.id = (root: IMessageModel, params, context) => root._id;

Message.from = (root: IMessageModel, params, context) =>
  context.handlers.User.fetchOne({ conditions: { id: root.from } }, context);

Message.timestamp = (root: IMessageModel, params, context) => {
  let id: ObjectID;
  if (typeof root._id === "string") {
    id = new ObjectId(root._id);
  } else {
    id = root._id;
  }
  return id.getTimestamp().getTime() / 1000;
};
