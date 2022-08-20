import {
  CityPostsTable as CITY_POSTS_TABLE,
  GET_CITY_DATA,
  GET_MESSAGES,
  POST_MESSAGE,
  ProfileParams,
  USERS_COLLECTION,
} from "./../../lib/consts"
import { getToken } from "next-auth/jwt"
import { NextApiResponse } from "next"
import { NextApiRequest } from "next"
import { dbAggregate, dbFind, dbInsertOne } from "../../lib/mongoUtils"
import { queryPlace, queryPlaces } from "../../lib/place"
import { getObjectKeys } from "../../lib/scripts/objects"

async function getValidCities(cityIds) {
  const validCities = await queryPlaces(cityIds)
  return validCities
}

async function PostMessage({ message, cityId }, userId) {
  const validPlaces = await getValidCities([cityId])
  const keys = getObjectKeys(validPlaces)
  if (keys.length === 0) return { error: "invalid city." }

  const result = await dbInsertOne(CITY_POSTS_TABLE, {
    timestamp: Date.now(),
    userId,
    message,
    cityId: Number(keys[0]),
  })
  if (!result.upsertedCount) return { error: "Error updating city table" }

  return { message: "post uploaded successfully" }
}

async function GetPosts(cityId) {
  const validPlaces = await getValidCities([cityId])
  const keys = getObjectKeys(validPlaces)
  if (keys.length === 0) return { error: "invalid city." }

  const request: AggregateReq = {
    collection: CITY_POSTS_TABLE,
    params: [
      {
        $lookup: {
          localField: "userId",
          foreignField: "userId",
          as: "profile",
          from: USERS_COLLECTION,
        },
      },
      { $match: { cityId: Number(keys[0]) } },
      {
        $project: {
          timestamp: 1,
          message: 1,
          userId: 1,
          profile: ProfileParams,
        },
      },
      {
        $sort: { timestamp: -1 },
      },
    ],
  }
  return await dbAggregate(request)
}

async function getCityData(cityIdsInput: string | string[]) {
  const cityIds = String(cityIdsInput)
  const cityIdsArray = cityIds.split(",")
  const validPlaces = await getValidCities(cityIdsArray)
  if (
    !validPlaces ||
    validPlaces.error ||
    getObjectKeys(validPlaces).length === 0
  )
    return { error: "invalid cities." }

  return validPlaces
}

type Response = {
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    const { method } = req.body || req.query
    const token = await getToken({ req })
    const { userId } = token
    let result = null

    if (!token || !userId) {
      throw new Error(`User not authenticated`)
    }

    console.log("request message", req.body)

    // Controller
    switch (method) {
      case POST_MESSAGE:
        result = await PostMessage(req.body, userId)
        break
      case GET_MESSAGES:
        result = await GetPosts(req.query.cityId)
        break
      case GET_CITY_DATA:
        result = await getCityData(req.query.cityIds)
        break
    }

    if (!result || result.error) res.status(400).json({ error: result.error })
    res.status(200).json(result)
  } catch (e) {
    console.log("ERROR ", e.message)
    res.status(500).json({ error: e.message })
  }
}
