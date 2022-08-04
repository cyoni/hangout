import { dbFind } from "./mongoUtils"

export async function getSharedToken(senderId, receiverId) {
    const result = await dbFind("messages_token", {
      $or: [
        { $and: [{ user1: senderId }, { user2: receiverId }] },
        { $and: [{ user1: receiverId }, { user2: senderId }] },
      ],
    })
    return result.length > 0 ? result[0].sharedToken : null
  }
  