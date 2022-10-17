import { ProfileParams, USERS_COLLECTION } from "../consts/consts"
import { dbAggregate, dbUpdateOne } from "../mongoApiUtils"
import { getFollowing } from "../../pages/api/followApi"
import { isNullOrEmpty } from "../scripts/strings"

export async function getProfile(
  userId,
  includeFollowing = false
): Promise<ResultHandler> {
  const req: AggregateReq = {
    collection: USERS_COLLECTION,
    params: [
      { $match: { userId } },
      { $project: { ...ProfileParams, aboutMe: 1 } },
    ],
  }
  const profile = (await dbAggregate(req))[0]

  if (profile) {
    let following: Following[] = []
    if (!includeFollowing) following = (await getFollowing(userId)) || null
    const result = { profile, following }
    return { value: result }
  } else {
    return { error: "User not found" }
  }
}

interface IUpdateUserPicture {
  userId: string
  pictureKey: "picture" | "wrapPicture"
  pictureIdKey?: "pictureId" | "wrapPictureId"
  fileId?: string
  name: string
}

export async function updateUserPictureInDb({
  userId,
  pictureKey,
  pictureIdKey,
  fileId,
  name,
}: IUpdateUserPicture): Promise<ResultHandler> {
  if (isNullOrEmpty(userId)) return { error: "user can't be null" }

  const obj = {
    [pictureKey]: name,
  }
  if (pictureIdKey && fileId) {
    obj[`metadata.${pictureIdKey}`] = fileId
  }
  const dbUploadImageResponse = await dbUpdateOne(
    USERS_COLLECTION,
    { userId },
    {
      $set: {
        ...obj,
      },
    },
    {}
  )
  if (!dbUploadImageResponse.modifiedCount) {
    return { error: "Picture could not be updated in db." }
  }
  return { isSuccess: true }
}
