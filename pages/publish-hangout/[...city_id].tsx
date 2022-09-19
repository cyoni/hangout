import { queryPlace } from "../../lib/place"
import { useRouter } from "next/router"
import PublishHangout from "../../components/PublishHangout/PublishHangout"

interface Props {
  place: Place
}
export default function Travelling({ place }: Props) {
  console.log("place", place)
  const router = useRouter()
  console.log("xxxxxxx", router.query.city_id)

  return <PublishHangout place={place} />
}

export async function getServerSideProps(context) {
  try {
    const cityId = context.query.city_id[1] || null
    if (isNaN(cityId)) {
      return {
        props: { place: null },
      }
    }
    const convertedCityId: number = Number(cityId)
    const place: Place = await queryPlace(convertedCityId)
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
