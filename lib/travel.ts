import {
  EMPTY_PROFILE_PICTURE,
  ITINERARIES_TABLE,
  USERS_COLLECTION,
} from "./consts"
import { dbAggregate, dbFind } from "./mongoUtils"
import { isNullOrEmpty } from "./scripts/strings"
import { JoinProfiles } from "./queryUtils"
import { deprecate } from "util"

const formatDate = (date) => {
  let d = new Date(date)
  let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d)
  let mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d)
  let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d)
  return `${da}/${mo}/${ye}`
}

export async function getAllTravelling() {
  const travelling = await dbFind(ITINERARIES_TABLE, {})
  const userIds = travelling.map((x, i) => {
    return x.userId
  })

  console.log("userIds", userIds)
  const profiles = await dbFind("users", { userId: { $in: userIds } })
  console.log("profiles", profiles)
  const result = travelling.map((item) => {
    const picture =
      profiles.filter((curr) => curr.userId === item.userId)[0]?.picture ||
      "https://www.innovaxn.eu/wp-content/uploads/blank-profile-picture-973460_1280.png"
    return { ...item, picture }
  })
  return result
}

const addEmptyProfileImageIfNeeded = (results) => {
  for (let i = 0; i < results.length; i++) {
    console.log("aaa current", results[i])
    results[i].profile = results[i].profile[0]
    if (!results[i].profile.picture)
      results[i].profile.picture = EMPTY_PROFILE_PICTURE
  }
}
// @deprecate
// export async function getRecentTravelersByCity(placeId: number) {
//   console.log("getRecentTravelersByCity", placeId)
//   if (isNullOrEmpty(placeId)) return null
//   const now = Date.now()
//   const result = await dbAggregate({
//     collection: ITINERARIES_TABLE,
//     params: [
//       {
//         $match: {
//           $and: [
//             { "itineraries.place.city_id": Number(placeId) },
//             { "itineraries.place.city_id": { $eq: Number(placeId) } },
//             { "itineraries.startDate": { $gt: new Date() } },
//           ],
//         },
//       },
//       JoinProfiles({}),
//       {
//         $project: {
//           userId: 1,
//           profile: 1,
//           description: 1,
//           itinerary: {
//             $filter: {
//               input: "$itineraries",
//               as: "travel",
//               cond: {
//                 $and: [
//                   { $eq: ["$$travel.place.city_id", Number(placeId)] },
//                   { $gt: ["$$travel.startDate", new Date()] },
//                 ],
//               },
//             },
//           },
//         },
//       },
//       {
//         $sort: {
//           "itinerary.startDate": 1,
//         },
//       },
//       {
//         $limit: 1,
//       },
//     ],
//   })
//   console.log("getRecentTravelersByCity result: ", JSON.stringify(result))
//   return result
// }

export async function getTravelContent(userId) {
  if (!userId || userId === undefined) {
    return false
  }
  console.log("getTravelContent", userId)
  const profileRaw = (await dbFind(USERS_COLLECTION, { userId }))[0]
  const travelsRaw = await dbFind(ITINERARIES_TABLE, { userId })

  const travels = travelsRaw.map((travel) => {
    return {
      ...travel,
      startDate: formatDate(travel.startDate),
      endDate: formatDate(travel.endDate),
    }
  })
  if (profileRaw != null) {
    const profile = {
      name: profileRaw.name != null ? profileRaw.name : "",
      userId: profileRaw.userId != null ? profileRaw.userId : "",
      intro: profileRaw.intro != null ? profileRaw.intro : "",
      picture: profileRaw.picture != null ? profileRaw.picture : "",
      location: profileRaw.location != null ? profileRaw.location : "",
    }
    return { travels, profile }
  } else {
    return null
  }
}
