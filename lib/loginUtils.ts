import { USERS_COLLECTION } from "./consts"
import { dbFind, dbInsertOne } from "./mongoUtils"
import generateRandomString, { isNullOrEmpty } from "./scripts/strings"

export async function getUserByEmail(email: string) {
  const user = (await dbFind(USERS_COLLECTION, { email }))[0]
  return user
}

export async function getUserByEmailAndPassword(
  email: string,
  password: string // encrypted password
) {
  const user = (
    await dbFind(USERS_COLLECTION, {
      $and: [{ email, password }],
    })
  )[0]
  return user
}

export async function createUser({ email, name, image }) {
  if (isNullOrEmpty(email) || isNullOrEmpty(name)) return false
  const user = await dbInsertOne(USERS_COLLECTION, {
    userId: generateRandomString(10),
    email,
    name,
    picture: image,
  })
  if (user.acknowledged) return true
  return false
}
