export function getFullPlaceName(place: Place) {
  if (!place) return ""
  return `${place.city}, ${place.province_short}, ${place.country}`
}
