import { gql } from "../../../utils";

export const UserWithToken = gql`
  type UserWithToken {
    user: User
    token: String
    expiresIn: Int
  }
`;
