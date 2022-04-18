import { Experiment_DrupalClient, DataCache } from "next-drupal"
import Redis from "ioredis"

const redis = new Redis(process.env.REDIS_URL)

export const cache: DataCache = {
  async set(key, value) {
    return await redis.set(key, value)
  },

  async get(key) {
    return await redis.get(key)
  },
}

export const drupal = new Experiment_DrupalClient(
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
  {
    debug: true,
    cache,
    auth: () =>
      "Basic " +
      Buffer.from(
        `${process.env.BASIC_AUTH_USERNAME}:${process.env.BASIC_AUTH_PASSWORD}`
      ).toString("base64"),
  }
)
