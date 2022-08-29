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

async function GetPosts({ cityId, page }) {
  const validPlaces = await getValidCities([cityId])
  const keys = getObjectKeys(validPlaces)
  const limit = 2
  if (keys.length === 0) return { error: "invalid city." }

  console.log("cityapi page:", page)
  const pageNumber = Number(page)
  if (pageNumber < 1) return { error: "page number must be greater than 0" }

  //const takeFrom = page > 0 ? page : Date.now()
  // console.log("takeFrom", Number(takeFrom))

  const request: AggregateReq = {
    collection: CITY_POSTS_TABLE,
    params: [
      { $sort: { timestamp: -1 } },
      {
        $match: {
          cityId: Number(keys[0]),
          //  timestamp: { $lt: Number(takeFrom) },
        },
      },
      {
        $skip: (pageNumber - 1) * limit,
      },
      { $limit: limit },
      {
        $lookup: {
          localField: "userId",
          foreignField: "userId",
          as: "profile",
          from: USERS_COLLECTION,
        },
      },
      {
        $project: {
          timestamp: 1,
          message: 1,
          userId: 1,
          profile: ProfileParams,
        },
      },
    ],
  }
  const posts = await dbAggregate(request)
  const nextPage = posts.length - limit === 0 ? pageNumber + 1 : undefined

  const result = {
    posts,
    nextPage,
  }

  return result
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
        result = await GetPosts({
          cityId: req.query.cityId,
          page: req.query.page,
        })
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
