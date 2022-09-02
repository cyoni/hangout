import { ProfileParams, USERS_COLLECTION } from "./consts"

export function JoinProfiles(
  foreignField = "userId",
  localField = "userId",
  as = "profile"
) {
  return {
    $lookup: {
      from: USERS_COLLECTION,
      as,
      foreignField, //: "userId",
      localField, //: "userId",
      pipeline: [
        {
          $project: {
            ...ProfileParams,
          },
        },
      ],
    },
  }
}
