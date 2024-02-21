export const NextApiRequest = jest.fn(function () {
  this.query = {
    slug: "/example",
    resourceVersion: "id:1",
    plugin: "simple_oauth",
    secret: "very-secret-key",
  }
  this.url = `https://example.com/?${new URLSearchParams(this.query)}`
  this.headers = {
    host: "https://example.com",
  }
})

export const NextApiResponse = jest.fn(function () {
  const headers = {
    "Set-Cookie": ["mock-cookie-value"],
  }
  const response = {
    statusCode: 200,
    status: jest.fn((statusCode) => {
      response.statusCode = statusCode
      return response
    }),
    clearPreviewData: jest.fn(() => response),
    setPreviewData: jest.fn(() => response),
    setDraftMode: jest.fn(() => response),
    getHeader: jest.fn((name) => headers[name]),
    setHeader: jest.fn((name, value) => {
      headers[name] = value
      return response
    }),
    writeHead: jest.fn(() => response),
    end: jest.fn(),
    json: jest.fn(),
  }
  return response
})
