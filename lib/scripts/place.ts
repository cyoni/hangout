export function getFullPlaceName(place: Place) {
  if (!place) return ""
  const answer = `${place.city}, ${place.province}${
    place.country ? `, ${place.country}` : ""
  }`
  return answer
}
