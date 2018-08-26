import { gql } from "../../../utils";

export const UserList = gql`
  type UserList {
    total: Int
    results: [User]
  }
`;
