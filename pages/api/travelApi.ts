import { getToken } from "next-auth/jwt"
import {
  GET_CITY_ITINERARIES,
  GET_USER_ITINERARIES,
  POST_NEW_ITINERARY,
  TRAVELLING_TABLE as TRAVELING_TABLE,
  TRAVELLING_TABLE,
} from "../../lib/consts"
import { dbAggregate, dbInsertMany } from "../../lib/mongoUtils"
import { JoinProfiles } from "../../lib/queryUtils"
import { convertStringToTypeArray } from "../../lib/scripts/arrays"

export async function postNewItinerary({ itineraries }, userId) {
  const dataToDb = {
    userId,
    timestamp: Date.now(),
    itineraries,
  }
  const data = [{ ...dataToDb }]
  console.log("data to db", data)

  const res: MongoInsertRes = await dbInsertMany(
    TRAVELING_TABLE,
    JSON.parse(JSON.stringify(data))
  )

  if (res.acknowledged)
    return { message: "itinerary was successfully created." }
  return { error: "Could not insert to db" }
}

export async function getUserItineraries({ userIds }) {
  const userIdsArray = convertStringToTypeArray(userIds, String)
  const request: AggregateReq = {
    collection: TRAVELLING_TABLE,
    params: [
      {
        $match: {
          userId: { $in: userIdsArray },
        },
      },
      JoinProfiles(),
    ],
  }

  const result = await dbAggregate(request)
  return result
}

export async function getCityItineraries({ cityIds }) {

  const convertedCityArray = Array.isArray(cityIds)
    ? cityIds
    : convertStringToTypeArray(cityIds, Number)

  const request: AggregateReq = {
    collection: TRAVELLING_TABLE,
    params: [
      {
        $match: {
          "itineraries.place.city_id": { $in: convertedCityArray },
        },
      },
      JoinProfiles(),
      {
        $project: {
          startDate: 1,
          endDate: 1,
          userId: 1,
          description: 1,
          itineraries: {
            $filter: {
              input: "$itineraries",
              as: "itinerary",
              cond: { $in: ["$$itinerary.place.city_id", convertedCityArray] },
            },
          },
        },
      },
    ],
  }
  const data = await dbAggregate(request)
  return data
}

export default async function handler(req, res) {
  try {
    const token = await getToken({ req })
    if (!token) throw Error("auth failed")

    const { userId } = token
    const { method } = req.body || req.query

    let result = null

    switch (method) {
      case GET_USER_ITINERARIES:
        result = await getUserItineraries(req.query)
        break
      case GET_CITY_ITINERARIES:
        result = await getCityItineraries(req.query)
        break
      case POST_NEW_ITINERARY:
        result = await postNewItinerary(req.body, userId)
        break
      default:
        return { error: "Invalid method" }
    }

    if (!result || result.error) {
      res.status(400).json({ message: result.error })
    }

    res.status(200).json(result)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}
