const withTM = require("next-transpile-modules")(["next-drupal"])

module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: [process.env.NEXT_IMAGE_DOMAIN],
  },
})
