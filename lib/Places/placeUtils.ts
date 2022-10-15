import { Place } from "../../pages/typings/typings"
import { getFullPlaceName } from "../consts/place"

// export async function getPlaceDetails(placeId: number) {
//   return "https://api.geoapify.com/v2/place-details?id=51d9e66b3b1264414059e7edbe19eb0a4040f00101f9015e18150000000000c00208&apiKey=76627608a79b4529a1d8faca267b7045"
// }

export function convertPlaceToQuery(place: Place) {
  if (!place) return ""
  const fullPlace = getFullPlaceName(place)
  return fullPlace.replaceAll(/(, | )/g, "-").toLocaleLowerCase()
}

export function convertRawPlaceToObject(place) {
  const mapper = ({
    result_type,
    city,
    state,
    country,
    country_code,
    place_id: placeId,
    lon,
    lat,
    formatted,
  }) => ({
    resultType: result_type,
    city,
    state,
    country,
    countryCode: country_code,
    lon,
    lat,
    formatted,
    placeId,
  })
  return mapper(place)
}
