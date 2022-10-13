import type { NextApiRequest, NextApiResponse } from "next"
import { PLACES_COLLECTION } from "../../lib/consts/collections"
import { dbFind, dbInsertMany } from "../../lib/mongoUtils"
import { convertPlaceToQuery } from "../../lib/Places/placeUtils"
import { newGet } from "../../lib/postman"
import { unique } from "../../lib/scripts/arrays"

type Response = {
  places: Place[]
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
        placeId: rawPlace.placeId,
        countryCode: rawPlace.countryCode,
        province_id: "NA1",
        province_short: "NA2",
        city: rawPlace.city,
        state: rawPlace.state,
        country: rawPlace.country,
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

interface IAutoCompleteResult {
  features: [
    {
      properties: {
        result_type: string
        city: string
        state: string
        country: string
        country_code: string
        place_id: string
        lon: string
        lat: string
        formatted: string
      }
    }
  ]
}

async function fetchAcData(input: string) {
  const serviceUrl = process.env.PLACES_AUTO_COMPLETE_SERVICE_URL
  const secret = process.env.PLACES_AUTO_COMPLETE_SECRET_KEY

  const result = await newGet(serviceUrl, { text: input, apiKey: secret })
  return result
}

async function queryAutoCompletePlace(input: string) {
  const data: IAutoCompleteResult = await fetchAcData(input)
  console.log("auto complete response", JSON.stringify(data))

  const placesArr: Place[] = []
  const filteredData = data.features.filter(
    (place) => place.properties.result_type === "city"
  )
  const placesToDb = filteredData.map((feature) => {
    const mapper = ({
      result_type,
      city,
      state,
      country,
      country_code,
      place_id,
      lon,
      lat,
      formatted,
    }) => ({
      resultType: result_type,
      city,
      state,
      country,
      countryCode: country_code,
      _id: "",
      placeId: place_id,
      lon,
      lat,
      formatted,
    })
    const dbPlaceObj = mapper(feature.properties)
    const place: Place = { ...dbPlaceObj, queryKey: dbPlaceObj._id }

    dbPlaceObj._id = convertPlaceToQuery(place)
    placesArr.push(place)
    return dbPlaceObj
  })

  console.log("placesToDb", placesToDb)

  // insert new results in db
  await dbInsertMany(PLACES_COLLECTION, placesToDb, false)

  console.log("auto complete places ", placesArr)
  return placesArr
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const input = String(req.query.input)
  const places = await queryAutoCompletePlace(input)
  if (Array.isArray(places)) res.status(200).json({ places })
  else res.status(400).json(places)
}
