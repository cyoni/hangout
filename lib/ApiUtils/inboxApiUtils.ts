import { MESSAGES_COLLECTION } from "../consts/consts"
import { dbAggregate, dbFind, dbUpdateMany, dbUpdateOne } from "../mongoApiUtils"
import { JoinProfiles } from "./queryApiUtils"

export async function resetUnreadMessages(userId: string) {
  await dbUpdateMany(
    MESSAGES_COLLECTION,
    { receiverId: userId },
    { $set: { isRead: true } },
    {}
  )
}

export async function getUnreadMsgsIds(userId: string) {
  const user = await dbFind("users", { userId: userId })
  if (!user) return { error: "getUnreadMsgsIds: No such user" }
  return user.unreadMsgsIds || []
}

export async function getPreviewMsgs(
  userId: string,
  allSharedTokens: string[]
) {
  return await dbAggregate({
    collection: "messages",
    params: [
      { $match: { sharedToken: { $in: allSharedTokens } } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: { sharedToken: "$sharedToken" },
          sharedToken: { $first: "$sharedToken" },
          receiverId: { $first: "$receiverId" },
          senderId: { $first: "$senderId" },
          timestamp: { $first: "$timestamp" },
          message: { $first: "$message" },
          isRead: {
            $first: {
              $cond: {
                if: { $eq: ["$receiverId", userId] },
                then: "$isRead",
                else: null,
              },
            },
          },
          theirId: {
            $first: {
              $cond: {
                if: { $eq: ["$receiverId", userId] },
                then: "$senderId",
                else: "$receiverId",
              },
            },
          },
        },
      },
      {
        $project: {
          theirId: 1,
          sharedToken: 1,
          senderId: 1,
          receiverId: 1,
          message: 1,
          timestamp: 1,
          isRead: 1,
        },
      },
      JoinProfiles({ localField: "theirId" }),
      { $sort: { timestamp: -1 } },
    ],
  })
}
