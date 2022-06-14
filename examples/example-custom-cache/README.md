# example-custom-cache

An example showing how to use Redis to cache global resources such as menus and global blocks during build.

## Example

```ts
import { DrupalClient, DataCache } from "next-drupal"
import Redis from "ioredis"

const redis = new Redis(process.env.REDIS_URL)

export const redisCache: DataCache = {
  async set(key, value) {
    return await redis.set(key, value)
  },

  async get(key) {
    return await redis.get(key)
  },
}

export const drupal = new DrupalClient(
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
  {
    cache: redisCache,
  }
)
```

## Documentation

See https://next-drupal.org/docs/client/cache

## License

Licensed under the [MIT license](https://github.com/chapter-three/next-drupal/blob/master/LICENSE).
