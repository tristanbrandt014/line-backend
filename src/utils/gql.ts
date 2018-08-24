import { GraphQLObject } from "../types";
import { gql as apollo } from "apollo-server-express";

export const gql = (schema: TemplateStringsArray): GraphQLObject => {
  const resolversWithSchema: GraphQLObject = {
    _schema: apollo(schema.raw[0])
  };
  return resolversWithSchema;
};
