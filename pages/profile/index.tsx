import { getToken } from "next-auth/jwt"
import { useRouter } from "next/router"
import React, { useEffect } from "react"

function index({ userId }) {
  const router = useRouter()
  console.log("useid", userId)

  return <div>Profile is empty</div>
}

export default index

export async function getServerSideProps(context) {
  const { userId } = await getToken(context)
  if (userId) {
    return {
      redirect: {
        permanent: false,
        destination: `/profile/${userId}`,
      },
    }
  }
  return {
    props: {
      userId: null,
    },
  }
}
