import "./env";
import { ApolloServer } from "apollo-server-express";
import { schema } from "./schema";
import { IRequest } from "./types";
import express from "express";
import cors from "cors";
import { AuthMiddleware } from "./middleware";
import { createServer } from "http";
import { createContext } from "./utils";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
import { pubsub, topics } from "./utils/pubsub";
import { connect as connectToDB } from "./db";
import { decodeToken } from "./handlers/User";
import User from "./handlers/User/model";

connectToDB();

const app = express();

app.use(cors());
app.use(AuthMiddleware);

const server = new ApolloServer({
  schema,
  context: async ({ req }: { req: IRequest }) => req.context
});
server.applyMiddleware({ app });

const port = process.env.PORT || 4000;

const ws = createServer(app);
ws.listen(port, () => {
  console.log(`Server ready at ${port}${server.graphqlPath}`);
  new SubscriptionServer(
    {
      execute,
      schema,
      subscribe,
      onConnect(options: any) {
        if (options && options.authorization) {
          const authenticate = async () => {
            const id = decodeToken(options.authorization);
            return User.findById(id);
          };
          return createContext(authenticate);
        }
        return createContext(async () => {});
      }
    },
    {
      path: "/graphql",
      server: ws
    }
  );
});
