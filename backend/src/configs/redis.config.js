import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URI, {
    maxRetriesPerRequest: 3,
      enableReadyCheck: true
    
})


redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("ready", () => {
  console.log("✅ Redis ready");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

redis.on("end", () => {
  console.log("Redis connection closed");
});

