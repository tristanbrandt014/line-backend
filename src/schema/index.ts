import { makeExecutableSchema } from "graphql-tools";
import * as schemas from "./imports";
import { getRootType, getTypes } from "./../utils";
import { gql } from "apollo-server-express";

const queries = getRootType(schemas, "queries");
const mutations = getRootType(schemas, "mutations");
const subscriptions = getRootType(schemas, "subscriptions");
const types = getTypes(schemas);
const baseSchema = gql`
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }

  type Query {
    init: Boolean
  }

  type Mutation {
    init: Boolean
  }

  type Subscription {
    init: Boolean
  }
`;

const baseResolvers = {
  Query: {
    init: () => true,
    ...queries.resolvers
  },
  Mutation: {
    init: () => true,
    ...mutations.resolvers
  },
  Subscription: {
    init: () => true,
    ...subscriptions.resolvers
  }
};

const typeDefs = [
  baseSchema,
  ...queries.schema,
  ...mutations.schema,
  ...subscriptions.schema,
  ...types.schema
];

const resolvers = {
  ...baseResolvers,
  ...types.resolvers
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });
