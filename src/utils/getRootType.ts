import * as _ from "lodash";
import { Schema } from "schema";
import { DocumentNode } from "graphql";

export interface RootType {
  schema: DocumentNode[];
  resolvers: {
    [fieldName: string]: () => any;
  };
}

export const getRootType = (
  schemaMap: Schema,
  type: "queries" | "mutations" | "subscriptions"
): RootType =>
  _.keys(schemaMap).reduce(
    (rootType, key) => {
      const obj = schemaMap[key][type];
      if (typeof obj !== "undefined" && obj._schema) {
        rootType.schema.push(obj._schema);
        rootType.resolvers = {
          ...rootType.resolvers,
          ..._.omit(obj, "_schema")
        };
      }
      return rootType;
    },
    { schema: [], resolvers: {} }
  );
