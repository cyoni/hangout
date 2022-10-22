import { getSession } from "next-auth/react"
import React from "react"
import ProfileError from "../../components/Profile/ProfileError"
import { checkUser } from "../../lib/scripts/session"

function index() {
  return <ProfileError />
}

export default index

export async function getServerSideProps(context) {
  const session = await getSession(context)
  const checkUserRes = checkUser(context, session)
  if (checkUserRes.redirect) return checkUserRes

  const { userId } = session
  if (userId) {
    return {
      redirect: { permanent: false, destination: `/profile/${userId}` },
    }
  }
  return { props: {} }
}
