import { DocumentNode } from "graphql";
import { IContext } from "../types";
import { ResolverFn } from "graphql-subscriptions";

export type Resolver = (root: any, params: any, context: IContext) => any;

export interface GraphQLObject {
  _schema: DocumentNode;
  [resolver: string]: Resolver | DocumentNode | { [key: string]: ResolverFn };
}

export interface Schema {
  [type: string]: {
    queries?: any;
    mutations?: any;
    subscriptions?: any;
    types: {
      [type: string]: GraphQLObject;
    };
  };
}
