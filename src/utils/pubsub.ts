import { RedisPubSub } from "graphql-redis-subscriptions";
import parseUrl from "url-parse";

let port = process.env.REDIS_PORT
  ? parseInt(process.env.REDIS_PORT, 10)
  : 63791;
let host = process.env.REDIS_HOST ? process.env.REDIS_HOST : "localhost";
let password = process.env.REDIS_PASSWORD;

if (process.env.REDIS_URL) {
  const parsed = parseUrl(process.env.REDIS_URL);
  port = parseInt(parsed.port, 10);
  host = parsed.hostname;
  password = parsed.password;
}

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
  NEW_MESSAGE = "newMessage",
  NEW_CHAT = "newChat"
}
