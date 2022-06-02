import { DefaultSession, Session } from "next-auth"
import { JWT } from "next-auth/jwt"
import { AccessToken } from "next-drupal"

declare module "next-auth" {
  interface User {
    accessToken: AccessToken
  }

  interface Session {
    accessToken: AccessToken
    user?: DefaultSession["user"] & {
      id: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: AccessToken
    accessTokenExpires: number
  }
}
