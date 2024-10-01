// // const { createClient } = require("redis");
// const Redis = require("ioredis");
// require("dotenv").config();

// // eslint-disable-next-line no-undef
// const url = process.env.REDIS_URL;
// // eslint-disable-next-line no-undef
// const port = 6379;
// const redis = new Redis({
//   host: url,
//   port: port, // Default Redis port
//   // password: 'your_redis_password_if_set', // Optional if Redis is password protected
//   tls: {}, // Optional if your Redis instance requires TLS
// });
// redis.on("connect", () => {
//   console.log("Connected to Redis successfully!");
// });

// redis.on("error", (err) => {
//   console.error("Redis connection error:", err);
// });

// module.exports = redis;
