import { get } from "./postman"

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
