import { getSession } from "next-auth/react"
import { useRouter } from "next/router"
import PublishHangout from "../../components/PublishHangout/PublishHangout"
import { checkUser } from "../../lib/scripts/session"
import { queryPlace } from "../api/queryPlacesApi"

interface Props {
  place: Place
}
export default function Travelling({ place }: Props) {
  console.log("place", place)
  const router = useRouter()
  console.log("xxxxxxx", router.query.placeId)

  return <PublishHangout place={place} />
}

export async function getServerSideProps(context) {
  try {

    const session = await getSession(context)
    const checkUserRes = checkUser(context, session)
    if (checkUserRes.redirect) return checkUserRes

    const placeId = context.query.placeId[1] || null
    if (!placeId) {
      return {
        props: { place: null },
      }
    }
    const place: Place = await queryPlace(placeId)
    return {
      props: { place: place },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { place: null },
    }
  }
}
