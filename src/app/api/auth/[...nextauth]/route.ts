// import NextAuth, { NextAuthConfig } from "next-auth"
// import GoogleProvider from "next-auth/providers/google"

// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       authorization: {
//         params: {
//           scope:
//             "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://mail.google.com/",
//           prompt: "consent",
//           access_type: "offline",
//           response_type: "code",
//         },
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, account }: { token: any; account: any }) {
//       // Persist the OAuth access_token and refresh_token to the token right after signin
//       if (account) {
//         token.accessToken = account.access_token
//         token.refreshToken = account.refresh_token
//         token.expiresAt = account.expires_at
//       }
//       return token
//     },
//     async session({ session, token }: { session: any; token: any }) {
//       // Send properties to the client
//       session.accessToken = token.accessToken
//       session.refreshToken = token.refreshToken
//       session.error = token.error
//       return session
//     },
//   },
//   pages: {
//     signIn: "/auth",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// }

// const handler = NextAuth(authOptions as NextAuthConfig)

// export { handler as GET, handler as POST }

import { handlers } from "@/auth"
export const { GET, POST } = handlers