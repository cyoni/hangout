import { getToken } from "next-auth/jwt"
import {
  GET_CITY_ITINERARIES,
  GET_USER_ITINERARIES,
  MAX_POSTS_PER_PAGE,
  POST_NEW_ITINERARY,
  TRAVELLING_TABLE as TRAVELING_TABLE,
  TRAVELLING_TABLE,
} from "../../lib/consts"
import { dbAggregate, dbInsertMany } from "../../lib/mongoUtils"
import { JoinProfiles } from "../../lib/queryUtils"
import { convertStringToTypeArray } from "../../lib/scripts/arrays"
import { getRecentTravelersByCity } from "../../lib/travel"

export async function postNewItinerary({ itineraries, description }, userId) {
  const dataToDb = {
    userId,
    timestamp: Date.now(),
    description,
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

      // $facet: {
      //   activeTravels: [
      //     {
      //       $match: {
      //         userId: { $in: userIdsArray },
      //         $expr: {
      //           $gt: [
      //             { $arrayElemAt: ["$itineraries.endDate", -1] },
      //             new Date(),
      //           ],
      //         },
      //       },
      //     },
      //     {
      //       $sort: { "itineraries.0.startDate": 1 },
      //     },
      //     JoinProfiles({}),
      //   ],
      //   pastTravels: [],
      // },
    ],
  }

  const data = (await dbAggregate(request))[0]
  const result = {
    activeTravels: data.activeTravels.filter((travel) => travel !== null),
    inactiveTravels: data.inactiveTravels.filter((travel) => travel !== null),
  }

  return result
}

export async function getCityItineraries({ cityIds, page }) {
  const convertedCityArray = Array.isArray(cityIds)
    ? cityIds
    : convertStringToTypeArray(cityIds, Number)

  const pageNumber = Number(page)

  if (isNaN(pageNumber) || pageNumber < 1)
    return { error: "Page number is invalid. Got: ", pageNumber }

  const matchFilter = {
    $match: {
      "itineraries.place.city_id": { $in: convertedCityArray },
    },
  }

  const request: AggregateReq = {
    collection: TRAVELLING_TABLE,
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
                      $in: ["$$itinerary.place.city_id", convertedCityArray],
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
    data.metadata.length > 0 &&
    (pageNumber - 1) * MAX_POSTS_PER_PAGE + data.travelers.length !==
      data.metadata[0].count
      ? pageNumber + 1
      : undefined

  const result = {
    nextPage,
    travelers: data.travelers,
  }

  return result
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
        result = await getRecentTravelersByCity(req.query.cityIds)
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
