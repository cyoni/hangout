export function getFullPlaceName(place: Place) {
  if (!place) return ""
  const answer = `${place.city}${place.province_short ? `, ${place.province_short}` : ""}${
    place.country ? `, ${place.country}` : ""
  }`
  return answer
}
