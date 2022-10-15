import { ProfileParams, USERS_COLLECTION } from "../consts/consts"

export function JoinProfiles({
  foreignField = "userId",
  localField = "userId",
  as = "profile",
}) {
  return {
    $lookup: {
      from: USERS_COLLECTION,
      foreignField,
      localField,
      pipeline: [
        {
          $set: {
            picture: {
              $ifNull: ["$picture", "broken-pic"],
            },
          },
        },
        {
          $project: {
            ...ProfileParams,
          },
        },
      ],
      as,
    },
  }
}
