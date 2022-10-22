import { getSession } from "next-auth/react"
import React from "react"
import PublishHangout from "../../components/PublishHangout/PublishHangout"
import { checkUser } from "../../lib/scripts/session"

export default function index() {
  return <PublishHangout />
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  const checkUserRes = checkUser(context, session)
  if (checkUserRes.redirect) return checkUserRes
  return { props: {} }
}
