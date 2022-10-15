import { Place } from "../../pages/typings/typings"

export function getFullPlaceName(place: Place) {
  if (!place) return ""
  const answer = `${place.city}, ${place.state}${
    place.country ? `, ${place.country}` : ""
  }`
  return answer
}

export function getPartsOfPlace(place, city, state = false, country = false) {
  if (!place) return ""
  const arr = []
  if (city) arr.push(place.city)
  if (state) arr.push(place.state)
  if (country) arr.push(place.country)
  return arr.join(", ")
}
