module.exports = {
  swcMinify: true,
  images: {
    domains: [process.env.NEXT_IMAGE_DOMAIN],
  },
  async rewrites() {
    return {
      afterFiles: [
        {
          source: "/",
          destination: "/page/0",
        },
      ],
    }
  },
}
