import NextAuth, {type Session} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {DrizzleAdapter} from "@auth/drizzle-adapter";
import { db } from "./lib/schema";

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {

        params:{
          access_type: "offline",
          prompt: "consent",
          include_granted_scopes: "false",
          scope: [
            "https://www.googleapis.com/auth/gmail.readonly",
            "https://www.googleapis.com/auth/gmail.modify",
            "https://www.googleapis.com/auth/gmail.send",
            "https://www.googleapis.com/auth/gmail.labels",
            "https://www.googleapis.com/auth/gmail.insert",
            "https://www.googleapis.com/auth/gmail.compose",
            "https://www.googleapis.com/auth/gmail.labels",
            "https://www.googleapis.com/auth/gmail.modify",
            "https://www.googleapis.com/auth/gmail.send",
            "https://www.googleapis.com/auth/gmail.readonly",
            "https://www.googleapis.com/auth/gmail.insert",
            "https://www.googleapis.com/auth/gmail.compose",
            "https://www.googleapis.com/auth/gmail.labels",
            "https://www.googleapis.com/auth/gmail.modify",
            "https://www.googleapis.com/auth/gmail.send",
            "https://www.googleapis.com/auth/gmail.readonly",
            "https://www.googleapis.com/auth/gmail.insert",
            "https://www.googleapis.com/auth/gmail.compose",
            "https://www.googleapis.com/auth/gmail.labels",
            "https://www.googleapis.com/auth/gmail.modify",
            "https://mail.google.com/",
            "openid",
            "email",
            "profile",
          ].join(" "),
          response: "code",
          
        }
      }
    }),
  ],

  callbacks: {
    async session({ session, user }: { session: Session, user: any }) {
        try {
            if (user && session?.user) {
                session.user.id = user.id;
            }
            return session;
        } catch (error) {
            console.error("Error in session callback:", error);
            return session;
        }
    },
}
})