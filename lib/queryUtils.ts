import { ProfileParams, USERS_COLLECTION } from "./consts"

interface Props {
  foreignField?: string
  localField?: string
  as?: string
}
export function JoinProfiles({
  foreignField = "userId",
  localField = "userId",
  as = "profile",
}: Props) {
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
