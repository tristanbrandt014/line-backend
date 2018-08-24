import { gql } from "../../../utils";
import { IUserModel } from "../../../handlers/User/model";

export const User = gql`
  type User {
    id: String
    username: String
    displayName: String
  }
`;

User.id = (root: IUserModel, params, context) => root._id;

User.displayName = (root: IUserModel, params, context) => root.display_name;
