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
