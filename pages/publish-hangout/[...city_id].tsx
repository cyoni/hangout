import { useRouter } from "next/router"
import PublishHangout from "../../components/PublishHangout/PublishHangout"
import { queryPlace } from "../api/placesAcApi"

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
    const placeId = context.query.placeId[1] || null
    if (isNaN(placeId)) {
      return {
        props: { place: null },
      }
    }
    const convertedplaceId: number = Number(placeId)
    const place: Place = await queryPlace(convertedplaceId)
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
