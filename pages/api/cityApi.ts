import {
  CityPostsTable as CITY_POSTS_TABLE,
  CITY_COMMENTS_TABLE,
  GET_CITY_DATA,
  GET_MESSAGES,
  GET_POST_COMMENTS,
  MAX_POSTS_PER_PAGE,
  POST_COMMENT,
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
import { isNullOrEmpty } from "../../lib/scripts/strings"
import { MESSAGE_EMPTY, POST_WAS_NOT_FOUND } from "../../lib/consts/error"
import { ObjectId } from "mongodb"
import { JoinProfiles } from "../../lib/queryUtils"

async function getValidCities(cityIds) {
  const validCities = await queryPlaces(cityIds)
  return validCities
}

async function PostMessage({ message, cityId }, userId) {
  if (isNullOrEmpty(String(message).trim()))
    return { error: "post is empty", id: MESSAGE_EMPTY }
  const validPlaces = await getValidCities([cityId])
  const keys = getObjectKeys(validPlaces)
  if (keys.length === 0) return { error: "invalid city." }

  const result = await dbInsertOne(CITY_POSTS_TABLE, {
    timestamp: Date.now(),
    userId,
    message,
    cityId: Number(keys[0]),
  })
  if (!result.insertedId) return { error: "Error updating city table" }

  return { message: "post uploaded successfully" }
}

async function PostComment({ message, postId }, userId) {
  if (isNullOrEmpty(message))
    return { error: "post is empty", id: MESSAGE_EMPTY }

  // post check
  const postCheck = await dbFind(CITY_POSTS_TABLE, {
    _id: new ObjectId(postId),
  })
  if (postCheck.length === 0)
    return { error: "post was not found", id: POST_WAS_NOT_FOUND }

  //const cityId = postCheck[0].cityId

  const result = await dbInsertOne(CITY_COMMENTS_TABLE, {
    timestamp: Date.now(),
    postId,
    userId,
    message,
  })
  if (!result.insertedId) return { error: "Error sending comment" }

  return { message: "comment uploaded successfully" }
}

export async function GetPosts({ cityId, take, page = 1 }) {
  const validPlaces = await getValidCities([cityId])
  const keys = getObjectKeys(validPlaces)

  if (keys.length === 0) return { error: "invalid city." }

  console.log("cityapi page:", page)
  const pageNumber = Number(page)
  if (pageNumber < 1) return { error: "page number must be greater than 0" }

  const filter = {
    cityId: Number(keys[0]),
  }
  const request: AggregateReq = {
    collection: CITY_POSTS_TABLE,
    params: [
      {
        $facet: {
          metadata: [
            {
              $match: filter,
            },
            {
              $count: "count",
            },
          ],
          posts: [
            { $sort: { timestamp: -1 } },
            {
              $match: filter,
            },
            {
              $skip: (pageNumber - 1) * MAX_POSTS_PER_PAGE,
            },
            { $limit: take ? Number(take) : MAX_POSTS_PER_PAGE },
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
        },
      },
    ],
  }
  const data = (await dbAggregate(request))?.[0]
  console.log("DATA FROM API", data)
  const posts = data.posts

  const result = {
    posts,
    totalPages: data.metadata[0]
      ? Math.ceil(data.metadata[0].count / MAX_POSTS_PER_PAGE)
      : 0,
  }

  return result
}

async function GetPostComments({ postId, page }) {
  if (isNullOrEmpty(postId)) return { error: "Post id is empty." }
  const pageNumber = Number(page)
  if (isNaN(pageNumber) || pageNumber < 1)
    return { error: "Page number is invalid. Got: ", pageNumber }

  const request = {
    collection: CITY_COMMENTS_TABLE,
    params: [
      {
        $facet: {
          metadata: [
            {
              $match: {
                postId,
              },
            },
            {
              $count: "count",
            },
          ],
          comments: [
            {
              $match: {
                postId,
              },
            },
            { $sort: { timestamp: -1 } },
            { $skip: (pageNumber - 1) * MAX_POSTS_PER_PAGE },
            { $limit: MAX_POSTS_PER_PAGE },
            JoinProfiles({}),
          ],
        },
      },
    ],
  }

  const data = (await dbAggregate(request))?.[0]

  console.log("Comments result:", data)

  const nextPage =
    data?.metadata.length > 0 &&
    (pageNumber - 1) * MAX_POSTS_PER_PAGE + data.comments.length !==
      data.metadata[0].count
      ? pageNumber + 1
      : undefined

  const result = {
    comments: data.comments,
    totalComments: data.metadata[0] ? data.metadata[0].count : 0,
    totalPages: data.metadata[0]
      ? Math.ceil(data.metadata[0].count / MAX_POSTS_PER_PAGE)
      : 0,
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
      case POST_COMMENT:
        result = await PostComment(req.body, userId)
        break
      case GET_MESSAGES:
        result = await GetPosts({
          cityId: req.query.cityId,
          page: req.query.page,
          take: req.query.take || null,
        })
        break
      case GET_POST_COMMENTS:
        result = await GetPostComments(req.query)
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
