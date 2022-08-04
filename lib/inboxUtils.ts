import { dbUpdateOne } from "./mongoUtils"

export async function resetUnreadMessages(userId: string) {
  dbUpdateOne("users", { userId: userId }, { $unset: { unreadMsgs: 1 } }, {})
}
