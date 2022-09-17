import { getToken } from "next-auth/jwt"
import { useRouter } from "next/router"
import React, { useEffect } from "react"
import ProfileError from "../../components/Profile/ProfileError"

function index() {
  return <ProfileError />
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
    props: {},
  }
}
