import { createClient } from "redis";

let redisClient;

(async () => {
  redisClient = createClient({
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD,
  });

  redisClient.on("error", (err) => console.log("Redis Client Error", err));
  redisClient.on("connect", () => {
    console.log("Redis Connected!");
  });

  await redisClient.connect();
})();

export default redisClient;
