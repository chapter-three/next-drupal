import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import jwt_decode from "jwt-decode"

export default NextAuth({
  providers: [
    // Configure the Password Grant.
    // This uses username and password for authentication.
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const formData = new URLSearchParams()

        formData.append("grant_type", "password")
        formData.append("client_id", process.env.DRUPAL_CLIENT_ID)
        formData.append("client_secret", process.env.DRUPAL_CLIENT_SECRET)
        formData.append("username", credentials.username)
        formData.append("password", credentials.password)

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/oauth/token`,
          {
            method: "POST",
            body: formData,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )

        const data = await response.json()

        if (response.ok && data?.access_token) {
          return data
        }

        return null
      },
    }),
    // Configure the Authorization Code Grant.
    // This redirects the user to the authorization server for login.
    {
      id: "drupal",
      name: "Next.js for Drupal",
      type: "oauth",
      version: "2.0",
      token: `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/oauth/token`,
      authorization: `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/oauth/authorize?response_type=code`,
      userinfo: `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/oauth/userinfo`,
      async profile(profile) {
        return {
          id: profile.sub,
          username: profile.preferred_username,
          name: profile.field_name,
          email: profile.email,
        }
      },
      clientId: process.env.DRUPAL_CLIENT_ID,
      clientSecret: process.env.DRUPAL_CLIENT_SECRET,
    },
  ],
  jwt: {
    signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
    encryption: true,
  },
  callbacks: {
    async jwt({ token, user }) {
      // Forward the access token from user.
      if (user) {
        token.accessToken = user.access_token
      }
      return token
    },
    async session({ session, token }) {
      if (token?.accessToken) {
        session.accessToken = token.accessToken

        // Decode token and pass info to session.
        // This is used for the Password Grant.
        const decoded = jwt_decode(token.accessToken)
        session.user.id = decoded.id
        session.user.email = decoded.email
        session.user.username = decoded.username
        session.user.name = decoded.field_name
      }
      return session
    },
  },
})
