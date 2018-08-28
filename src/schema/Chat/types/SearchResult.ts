import { gql } from "../../../utils";

export const SearchResult = gql`
  type SearchResult {
    chat: Chat
    matches: [Message]
  }
`;

SearchResult.chat = (root, params, context) => root;

SearchResult.matches = (root, params, context) => root.matches;
