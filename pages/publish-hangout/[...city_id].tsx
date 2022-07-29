import { useState } from "react"
import LocationAutoComplete from "../../components/placesAc"
import Spinner from "react-bootstrap/Spinner"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { queryPlace } from "../../lib/place"
import HeaderImage from "../../components/HeaderImage"
import toast from "react-hot-toast"
import { useRouter } from "next/router"
import { getFullPlaceName } from "../../lib/scripts/place"
import PublishHangout from "../../components/PublishHangout"

interface Props {
  place: Place
}
export default function Travelling({ place }: Props) {
  console.log("place", place)
  const router = useRouter()
  console.log("xxxxxxx", router.query.city_id)

  return (
    <div>
      <PublishHangout place={place} />
    </div>
  )
}

export async function getServerSideProps(context) {
  try {
    const cityId = context.query.city_id[1] || null
    if (isNaN(cityId)) {
      return {
        props: { place: null },
      }
    }
    const convertedCityId = Number(cityId)
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
