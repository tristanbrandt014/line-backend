import { gql } from "../../../utils";

export const ChatList = gql`
  type ChatList {
    total: Int
    results: [Chat]
  }
`;
