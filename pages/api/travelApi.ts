import { getToken } from "next-auth/jwt"
import {
  GET_CITY_ITINERARIES,
  GET_USER_ITINERARIES,
  MAX_POSTS_PER_PAGE,
  POST_NEW_ITINERARY,
  ITINERARIES_TABLE as TRAVELING_TABLE,
  ITINERARIES_TABLE,
} from "../../lib/consts/consts"
import { dbAggregate, dbInsertMany } from "../../lib/mongoApiUtils"
import { JoinProfiles } from "../../lib/queryApiUtils"
import { convertStringToTypeArray } from "../../lib/scripts/arrays"

function convertItineraries(itineraries) {
  const convertedItineraries = []
  itineraries.forEach((itinerary) => {
    convertedItineraries.push({
      startDate: new Date(itinerary.startDate),
      endDate: new Date(itinerary.endDate),
      placeId: itinerary.place.placeId,
    })
  })
  return convertedItineraries
}

export async function postNewItinerary({ itineraries, description }, userId) {
  const dataToDb = {
    userId,
    timestamp: Date.now(),
    description,
    itineraries: convertItineraries(itineraries),
  }
  const data = [{ ...dataToDb }]
  console.log("data to db", data)

  const res: MongoInsertRes = await dbInsertMany(
    TRAVELING_TABLE,
    data // JSON.parse(JSON.stringify(data))
  )

  if (res.acknowledged)
    return { message: "itinerary was successfully created." }
  return { error: "Could not insert to db" }
}

export async function getUserItineraries({ userIds }) {
  console.log("getUserItineraries", userIds)
  if (!userIds) return { error: "User_ids is null" }
  userIds = convertStringToTypeArray(userIds, String)
  const request: AggregateReq = {
    collection: ITINERARIES_TABLE,
    params: [
      {
        $match: {
          userId: { $in: userIds },
        },
      },
      {
        $sort: { "itineraries.startDate": 1 },
      },
      {
        $group: {
          _id: null,
          activeTravels: {
            $push: {
              $cond: {
                if: {
                  $gt: [
                    { $arrayElemAt: ["$itineraries.endDate", -1] },
                    new Date(),
                  ],
                },
                then: "$$ROOT",
                else: null,
              },
            },
          },
          inactiveTravels: {
            $push: {
              $cond: {
                if: {
                  $lt: [
                    { $arrayElemAt: ["$itineraries.endDate", -1] },
                    new Date(),
                  ],
                },
                then: "$$ROOT",
                else: null,
              },
            },
          },
        },
      },
    ],
  }

  const data = (await dbAggregate(request))[0]
  const result = {
    activeTravels: data?.activeTravels.filter((travel) => travel !== null),
    inactiveTravels: data?.inactiveTravels.filter((travel) => travel !== null),
  }

  return result
}

export async function getCityItineraries({
  placeIds,
  showAll = false,
  page = 1,
}) {
  console.log("convertedCityArray", placeIds)

  const convertedCityArray = Array.isArray(placeIds)
    ? placeIds
    : convertStringToTypeArray(placeIds, String)

  const pageNumber = Number(page)

  if (isNaN(pageNumber) || pageNumber < 1)
    return { error: "Page number is invalid. Got: ", pageNumber }

  const matchFilter = {
    $match: {
      $and: [
        { "itineraries.placeId": { $in: convertedCityArray } },
        { "itineraries.startDate": { $gt: new Date() } },
        { "itineraries.endDate": { $gt: new Date() } },
      ],
    },
  }

  const request: AggregateReq = {
    collection: ITINERARIES_TABLE,
    params: [
      {
        $facet: {
          metadata: [matchFilter, { $count: "count" }],
          travelers: [
            matchFilter,
            { $skip: (pageNumber - 1) * MAX_POSTS_PER_PAGE },
            { $limit: MAX_POSTS_PER_PAGE },
            JoinProfiles({}),
            {
              $project: {
                startDate: 1,
                endDate: 1,
                userId: 1,
                description: 1,
                profile: 1,
                itineraries: {
                  $filter: {
                    input: "$itineraries",
                    as: "itinerary",
                    cond: {
                      $in: ["$$itinerary.placeId", convertedCityArray],
                    },
                  },
                },
              },
            },
          ],
        },
      },
    ],
  }
  const data = (await dbAggregate(request))[0]

  const nextPage =
    data?.metadata.length > 0 &&
    (pageNumber - 1) * MAX_POSTS_PER_PAGE + data.travelers.length !==
      data.metadata[0].count
      ? pageNumber + 1
      : null // undefined

  const result = {
    nextPage,
    travelers: data?.travelers,
  }
  console.log("dfgfdgfdgdfg", nextPage)
  return result
}

// Controller
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
        result = await getCityItineraries({ ...req.query })
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
