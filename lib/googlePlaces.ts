import { Client, PlaceInputType } from "@googlemaps/google-maps-services-js"

export async function getPhotoReference(input) {
  try {
    const client = new Client({})
    console.log("getPhotoReference input", input)
    const response = await client.findPlaceFromText({
      params: {
        input: input,
        inputtype: PlaceInputType.textQuery,
        fields: ["photos"],
        key: process.env.GOOGLE_PLACES_API_KEY,
      },
      timeout: 1000, // milliseconds
    })

    console.log("response",response)
    console.log("photos", response?.data?.candidates[0]?.photos)
    const photoRef = response?.data?.candidates[0]?.photos?.[0].photo_reference
    return photoRef
  } catch (e) {
    console.log(e.response.data.error_message)
  }
}

export async function getPhotoByPhotoRef(photoRef: string) {
  console.log("getPhotoByPhotoRef input", photoRef)
  console.log("key", process.env.GOOGLE_PLACES_API_KEY)
  try {
    const client = new Client({})
    const response = await client.placePhoto({
      params: {
        photoreference: photoRef,
        maxwidth: 2500,
        maxheight: 1500,
        key: process.env.GOOGLE_PLACES_API_KEY,
      },
      responseType: "arraybuffer",
    })

    const data = response.data

    const imageInBase64 = Buffer.from(data).toString("base64")
    const result = "data:image/png;base64," + imageInBase64

    return result
  } catch (e) {
    console.log("error", e)
  }
}
