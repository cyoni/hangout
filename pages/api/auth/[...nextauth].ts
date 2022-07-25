import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import { encode } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const result = await fetch(`${process.env.DOMAIN_URL}/api/loginApi`, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        })

        console.log("loginresult", result)
        // If no error and we have user data, return it
        if (result.status === 200) {
          const data = await result.json()
          console.log("session user", data)
          return data
        }
        // Return null if user data could not be retrieved
        return null
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  jwt: {
    // The maximum age of the NextAuth.js issued JWT in seconds.
    // Defaults to `session.maxAge`.
    maxAge: 60 * 60 * 24 * 30,
  },
  pages: {
    signIn: `${process.env.DOMAIN_URL}/login`,
    signOut: "/",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      console.log("USER", user)
      // Persist the OAuth access_token to the token right after signin
      if (user) {
        token.place = user.place
        token.userId = user.userId
      }
      console.log("TOKEN TOKEN ", token)
      return token
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.place = token.place
      session.userId = token.userId
      console.log("session user", user)
      console.log("session token", token)
      console.log("session. ", session)
      return session
    },
  },
  logger: {
    error(code, metadata) {
      console.error(code, metadata)
    },
    warn(code) {
      console.warn(code)
    },
    debug(code, metadata) {
      console.debug(code, metadata)
    },
  },
}
export default NextAuth(authOptions)
