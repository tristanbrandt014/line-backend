import { RedisPubSub } from "graphql-redis-subscriptions";

const port = process.env.REDIS_PORT
  ? parseInt(process.env.REDIS_PORT, 10)
  : 63791;
const host = process.env.REDIS_HOST ? process.env.REDIS_HOST : "localhost";
const password = process.env.REDIS_PASSWORD;

export const pubsub = new RedisPubSub({
  connection: {
    host,
    port,
    ...(password ? { password } : {}),

    retryStrategy: (times: number) => {
      // reconnect after
      return Math.max(times * 100, 3000);
    }
  }
});

export enum topics {
  POLL = "poll",
  NEW_MESSAGE = "newMessage"
}
