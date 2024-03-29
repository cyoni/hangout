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
} from "../../lib/consts/consts"
import { getToken } from "next-auth/jwt"
import { NextApiResponse } from "next"
import { NextApiRequest } from "next"
import { dbAggregate, dbFind, dbInsertOne } from "../../lib/mongoApiUtils"
import { getObjectKeys } from "../../lib/scripts/objects"
import { isNullOrEmpty } from "../../lib/scripts/strings"
import { MESSAGE_EMPTY, POST_WAS_NOT_FOUND } from "../../lib/consts/error"
import { ObjectId } from "mongodb"
import { JoinProfiles } from "../../lib/ApiUtils/queryApiUtils"
import { queryPlaces } from "./queryPlacesApi"

async function getValidCities(placeIds) {
  const validCities = await queryPlaces(placeIds)
  return validCities
}

async function PostMessage({ message, placeId }, userId) {
  if (isNullOrEmpty(String(message).trim()))
    return { error: "post is empty", id: MESSAGE_EMPTY }
  const validPlaces = await getValidCities([placeId])
  const verifiedplaceId = getObjectKeys(validPlaces)[0]
  if (!verifiedplaceId) return { error: "invalid city." }

  const result = await dbInsertOne(CITY_POSTS_TABLE, {
    timestamp: Date.now(),
    userId,
    message,
    placeId: verifiedplaceId,
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

  //const placeId = postCheck[0].placeId

  const result = await dbInsertOne(CITY_COMMENTS_TABLE, {
    timestamp: Date.now(),
    postId,
    userId,
    message,
  })
  if (!result.insertedId) return { error: "Error sending comment" }

  return { message: "comment uploaded successfully" }
}

export async function GetPosts({ placeId, take, page = 1 }) {
  const validPlaces = await getValidCities([placeId])
  const keys = getObjectKeys(validPlaces)

  if (keys.length === 0) return { error: "invalid city." }

  console.log("cityapi page:", page)
  const pageNumber = Number(page)
  if (pageNumber < 1) return { error: "page number must be greater than 0" }

  const filter = {
    placeId: keys[0],
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

async function getCityData(placeIdsInput: string | string[]) {
  const placeIds = String(placeIdsInput)
  const placeIdsArray = placeIds.split(",")
  const validPlaces = await getValidCities(placeIdsArray)
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
          placeId: req.query.placeId,
          page: Number(req.query.page),
          take: req.query.take || null,
        })
        break
      case GET_POST_COMMENTS:
        result = await GetPostComments({
          postId: String(req.query.postId),
          page: Number(req.query.page),
        })
        break
      case GET_CITY_DATA:
        result = await getCityData(req.query.placeIds)
        break
    }

    if (!result || result.error) res.status(400).json({ error: result.error })
    res.status(200).json(result)
  } catch (e) {
    console.log("ERROR@@@@", e.message)
    res.status(500).json({ error: e.message })
  }
}
