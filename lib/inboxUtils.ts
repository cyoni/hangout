import { dbAggregate, dbFind, dbUpdateOne } from "./mongoUtils"

export async function resetUnreadMessages(userId: string) {
  dbUpdateOne("users", { userId: userId }, { $unset: { unreadMsgs: 1 } }, {})
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
          profile: { picture: 1, name: 1, cityId: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "userId",
          localField: "theirId",
          as: "profile",
        },
      },
      { $sort: { timestamp: -1 } },
    ],
  })
}
