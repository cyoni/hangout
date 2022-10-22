import { NextPageContext } from "next"
import { Session } from "next-auth"
import { get } from "../postman"
import { getReferer } from "./server/getReferrer"
import { isNullOrEmpty } from "./strings"

export const isAuthenticated = (session) => {
  return isSessionReady(session) && session.status === "authenticated"
}

export const isAuthor = (session, userId) => {
  return isAuthenticated(session) && session.data?.userId === userId
}

export const isNotAuthenticated = (session) => {
  return isSessionReady(session) && session.status === "unauthenticated"
}

export const isSessionReady = (session) => {
  return session && session.status !== "loading"
}

export const updateSessionData = async (body) => {
  const result = await get("/api/auth/session", { q: "update", ...body })
  return result
}

export function checkUser(context: NextPageContext, session: Session) {
  const redirect = (destination: string) => {
    console.log("destination", destination)
    return { redirect: { permanent: false, destination } }
  }

  const referrer = getReferer(context.req)

  if (!session) {
    if (!referrer.startsWith("/login") && !referrer.startsWith("/signup")) {
      return redirect("/login")
    }
  } else if (
    isNullOrEmpty(session.place?.placeId) &&
    !referrer.startsWith("/account/setupaccount")
  ) {
    // if so, user should configure their place
    return redirect("/account/setupaccount")
  }

  return { redirect: undefined, status: "ok" }
}
