import { DefaultSession, Session } from "next-auth"

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      id?: string
      username?: string
    }
  }
}

type DecodedUserInfo = {
  id: string
  email: string
  username: string
  field_name: string
}
