export async function getCitiesAutoComplete(input: string) {
  const data = await fetch(`/api/placesAcApi?input=${input}`)
  if (data.status == 200) {
    const json = await data.json()
    const places: Place[] = json.places
    return places
  }
}
