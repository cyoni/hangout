import { PLACES_COLLECTION } from "../../lib/consts/collections"
import { dbFind } from "../../lib/mongoApiUtils"
import { unique } from "../../lib/scripts/arrays"

export async function initializeDuplicateCities() {
  global.duplicateCities = await dbFind("duplicateCities", {})
}

export async function queryPlace(placeId: string) {
  const rawPlace = (
    await dbFind(PLACES_COLLECTION, {
      $or: [{ placeId }, { _id: placeId }],
    })
  )[0]

  console.log("queryPlace", rawPlace)

  const place: Place = rawPlace
    ? {
        cityId: rawPlace._id,
        ...rawPlace,
      }
    : null
  return place
}
export async function queryPlaces(
  placeIds: string[]
): Promise<{ [id: number]: Place; error?: string }> {
  if (!Array.isArray(placeIds)) return { error: "bad input" }

  const idsToQuery = unique(placeIds)

  const rawPlaces = await dbFind(PLACES_COLLECTION, {
    $or: [{ _id: { $in: idsToQuery } }, { placeId: { $in: idsToQuery } }],
  })

  const results: { [id: number]: Place } = rawPlaces.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.placeId]: {
        cityId: curr._id,
        placeId: curr.placeId,
        countryCode: curr.countryCode,
        province_id: "NA3",
        province_short: "NA4",
        city: curr.city,
        state: curr.state,
        country: curr.country,
      },
    }),
    {}
  )

  return results
}

export default async function handler(req, res) {
  try {
    //const token = await getToken({ req })
    // if (!token) res.status(400)
    // const senderId = token.userId
    console.log("###")
    const { codes } = req.body
    console.log("codescodes", codes)

    if (Array.isArray(codes) && codes.length > 0) {
      const result = await queryPlaces(codes)
      if (result) res.status(200).json(result)
    } else throw Error("request invalid")
  } catch (e) {
    res.status(400).json(JSON.stringify(e.message))
  }
}
