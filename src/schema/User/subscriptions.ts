import { gql } from "../../utils";
import { withFilter } from "graphql-subscriptions";
import { pubsub, topics } from "../../utils/pubsub";

export const Subscription = gql`
  extend type Subscription {
    poll: Int
  }
`;

Subscription.poll = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(topics.POLL),
    async (payload, variables) => {
      return true;
    }
  )
};
