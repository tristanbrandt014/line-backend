import { IContext } from "context";
import Chat, { IChatModel, IMessageModel } from "./model";
import { errors } from "../../utils/errors";

interface ISearchResult {
  chat: IChatModel;
  matches: IMessageModel[];
}

type Search = (
  args: {
    term: string;
  },
  context: IContext
) => Promise<ISearchResult[]>;

export const search: Search = async (args, context) => {
  const currentUser = await context.authenticate();
  if (!currentUser) {
    throw new Error(errors.UNAUTHENTICATED);
  }
  const result = await Chat.aggregate([
    // Chats of current user
    {
      $match: {
        users: currentUser._id
      }
    },
    // Add field "matches"
    {
      $addFields: {
        matches: "$messages"
      }
    },
    // filter matches by messages with content that contain search term
    {
      $project: {
        _id: 1,
        users: 1,
        messages: 1,
        matches: {
          $filter: {
            input: "$matches",
            as: "match",
            cond: {
              $gt: [
                {
                  $indexOfCP: [
                    { $toLower: "$$match.content" },
                    args.term.toLocaleLowerCase()
                  ]
                },
                -1
              ]
            }
          }
        }
      }
    },
    // filter out chats with no matches
    {
      $match: {
        matches: {
          $ne: []
        }
      }
    }
  ]);
  return result;
};
