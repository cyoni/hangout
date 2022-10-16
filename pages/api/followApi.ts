import {
  CITY,
  FOLLOW,
  ProfileParams,
  STOP_FOLLOW,
  USERS_COLLECTION,
  XY_FOLLOW_EACH_OTHER,
  X_FOLLOWS_Y,
} from "../../lib/consts/consts"
import { getToken } from "next-auth/jwt"
import { NextApiRequest, NextApiResponse } from "next"
import { GET_FOLLOWING, START_FOLLOW } from "../../lib/consts/consts"
import {
  dbAggregate,
  dbDeleteOne,
  dbFind,
  dbUpdateOne,
  findTwoUsers as getFindTwoUsersFilter,
} from "../../lib/mongoApiUtils"
import { FOLLOW_TABLE } from "../../lib/consts/collections"
import { isNullOrEmpty } from "../../lib/scripts/strings"
import { queryPlaces } from "./queryPlacesApi"


type Response = {
  error?: string
}

async function follow(body, me: string) {
  const { userId, placeId, type } = body

  let result = null
  switch (type) {
    case FOLLOW:
      result = await followMember(userId, me)
      break
    case CITY:
      result = await followCity(placeId, me)
      break
    default:
      result = { error: "INVALID TYPE" }
  }

  return result
}

async function unFollow(body, me: string) {
  const { userId, type } = body

  let result = null

  switch (type) {
    case FOLLOW:
      result = await unfollowMember(userId, me)
      break
    case CITY:
      result = await unfollowCity(body, me)
      break
    default:
      return { error: "INVALID TYPE" }
  }

  return result
}
async function unfollowCity({ placeId }, userId: string) {
  if (isNullOrEmpty(placeId) || isNullOrEmpty(userId))
    return { error: "bad request. userId or placeId is required" }

  const result: MongoUpdateRes = await dbUpdateOne(
    FOLLOW_TABLE,
    { placeId, type: CITY },
    { $pull: { userIds: { $in: [userId] } } },
    {}
  )
  if (result.acknowledged) return { message: "success" }
  else return { error: "could not update in unfollow city" }
}
async function unfollowMember(userId: string, me: string) {
  if (isNullOrEmpty(userId)) {
    return { error: "INVALID USER" }
  }

  const data = await dbFind(FOLLOW_TABLE, {
    $or: [{ user1: userId }, { user2: userId }],
    $and: [
      { $or: [{ method: X_FOLLOWS_Y }, { method: XY_FOLLOW_EACH_OTHER }] },
    ],
  })

  if (data.length === 1) {
    const result = data[0]
    if (result.method == X_FOLLOWS_Y) {
      // DELETE
      const removeDocument = await dbDeleteOne(
        FOLLOW_TABLE,
        getFindTwoUsersFilter(me, userId)
      )
      console.log("removeDocument", removeDocument)
    } else {
      const r = await dbUpdateOne(
        FOLLOW_TABLE,
        getFindTwoUsersFilter(me, userId),
        { $set: { user1: userId, user2: me, method: X_FOLLOWS_Y } }, // SWAP USERS
        {}
      )
    }
  }
  return { message: "success" }
}
export async function getFollowing(userId) {
  console.log("getFollowing userId", userId)
  let data = null
  try {
    data = await dbAggregate({
      collection: FOLLOW_TABLE,
      params: [
        {
          $facet: {
            members: [
              {
                $match: {
                  type: FOLLOW,
                  $or: [
                    { $and: [{ user1: userId }, { method: X_FOLLOWS_Y }] },
                    {
                      $and: [
                        { user2: userId },
                        { method: XY_FOLLOW_EACH_OTHER },
                      ],
                    },
                  ],
                },
              },
              {
                $lookup: {
                  from: USERS_COLLECTION,
                  let: {
                    localField: {
                      $cond: {
                        if: { $eq: ["$user1", userId] },
                        then: "$user2",
                        else: "$user1",
                      },
                    },
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$$localField", "$userId"] },
                      },
                    },
                  ],
                  as: "profile",
                },
              },
              {
                $project: {
                  userId: {
                    $cond: {
                      if: { $eq: ["$user1", userId] },
                      then: "$user2",
                      else: "$user1",
                    },
                  },
                  profile: ProfileParams,
                },
              },
            ],
            cities: [
              {
                $match: {
                  type: CITY,
                  userIds: { $in: [userId] },
                },
              },
              {
                $group: {
                  _id: null,
                  placeIds: { $push: "$placeId" },
                },
              },
              {
                $project: {
                  _id: 0,
                  placeIds: 1,
                },
              },
            ],
          },
        },
      ],
    })
  } catch (e) {
    console.log("getFollowing MONGO ERROR: ", e.message)
  }

  console.log("getFollowing", JSON.stringify(data))

  return data[0]
}

async function followMember(userId: any, me: string) {
  if (isNullOrEmpty(userId)) {
    return { error: "no userId found." }
  }

  // check if the requester already follows
  const filter = getFindTwoUsersFilter(userId, me)

  // const isUserValid = await validateUser()

  let newMethod = X_FOLLOWS_Y
  const response = await dbAggregate({
    collection: FOLLOW_TABLE,
    params: [{ $match: filter }],
  })

  if (response && response.user2 === me) {
    newMethod = XY_FOLLOW_EACH_OTHER
  }

  const r = await dbUpdateOne(
    FOLLOW_TABLE,
    filter,
    { $set: { user1: me, user2: userId, method: newMethod, type: FOLLOW } },
    { upsert: true }
  )

  console.log("r", r)
  return { result: "OK" }
}
export async function followCity(placeId: string, me: string) {
  if (isNullOrEmpty(placeId)) return { error: "city id id empty" }
  const type = CITY

  // city check
  const place: Place = await queryPlaces(placeId)
  if (place == null) return { error: "city is invalid" }

  const result: MongoUpdateRes = await dbUpdateOne(
    FOLLOW_TABLE,
    { placeId, type },
    { $addToSet: { userIds: me }, $set: { placeId, type } },
    { upsert: true }
  )

  if (result.acknowledged) return { message: "success" }
  else return { error: "could not update db" }

}

// Controller
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    let result = null
    const { method } = req.body || req.query
    const token = await getToken({ req })
    const { userId } = token

    if (!token || !userId) {
      throw new Error(`User not authenticated`)
    }

    console.log("request message", req.body)

    switch (method) {
      case START_FOLLOW:
        result = await follow(req.body, userId)
        break
      case STOP_FOLLOW:
        result = await unFollow(req.body, userId)
        break
      case GET_FOLLOWING: {
        result = await getFollowing(req.query.userId ?? userId)
        break
      }
    }

    if (!result || result.error) res.status(400).json({ error: result.error })
    res.status(200).json(result)
  } catch (e) {
    console.log("ERROR ", e.message)
    res.status(500).json({ error: e.message })
  }
}
