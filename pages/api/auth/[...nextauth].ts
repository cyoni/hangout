import GoogleProvider from "next-auth/providers/google"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import {
  createUser,
  getUserByEmail,
  registerUserFlow,
} from "../../../lib/loginUtils"
import { updateUserPictureInDb } from "../../../lib/profileUtils"

export const authOptions = (req) => ({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_SIGN_IN_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SIGN_IN_SECRET_KEY,
    }),
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
    async jwt({ token, account, user, profile }) {
      // UPDATE TOKEN AFTER SIGN UP
      console.log("req.url", req.url)
      if (String(req.url).includes("session?q=update")) {
        const { placeId, picture } = req.query
        if (placeId) token.place = { placeId: Number(placeId) }
        token.picture = picture === "REMOVE" ? null : picture || token.picture
        console.log("NEW TOKEN", token)
        return token
      }

      console.log("AUTH USER", user)
      console.log("AUTH ACCOUNT", account)
      console.log("AUTH TOKEN", token)

      let userInstance = { ...user }

      if (user) {
        // gets here only during login / sign in via social network
        // check if user exists, if so return their data
        console.log("user email is", token.email)
        const userFromDb = await getUserByEmail(token.email)
        console.log("userFromDb", userFromDb)
        if (userFromDb) {
          userInstance = { ...userFromDb }
        } else {
          // if not, create a new account
          console.log("user.name", user.name)
          user.name = (user.name?.split(" "))[0]
          console.log("new use is", user)
          const newUser = await registerUserFlow(user)
          userInstance = { ...newUser }
          if (!newUser) {
            console.log("CREATING NEW USER FAILED")
            return null
          }
          userInstance.userId = newUser.userId
        }

        token.name = userInstance.name
        token.place = { placeId: userInstance.placeId }
        token.userId = userInstance.userId
        token.picture = userInstance.picture || user.image

        if (!userInstance.picture && user.image) {
          // update user picture in db
          await updateUserPictureInDb({
            userId: userInstance.userId,
            pictureKey: "picture",
            name: user.image,
          })
        }
      }

      console.log("NEXT AUTH: USER TOKEN ", token)
      return token
    },
    async session({ session, token, user }) {
      console.log("REQ.URL in sesion", req.url)
      // Send properties to the client, like an access_token from a provider.
      session.place = token.place
      session.userId = token.userId
      console.log("session user", user)
      console.log("session token", token)
      console.log("session. ", session)
      return session
    },
    // async redirect({ url, baseUrl }) {
    //   return baseUrl
    // },
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
})
// export default NextAuth(req, res, authOptions(req))

const NextAuthWrapper = async (req, res) => {
  return NextAuth(req, res, authOptions(req))
}
export default NextAuthWrapper
