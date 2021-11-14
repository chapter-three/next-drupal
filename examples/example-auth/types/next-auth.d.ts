import { DefaultSession, Session } from "next-auth"

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      username?: string
    }
  }
}
