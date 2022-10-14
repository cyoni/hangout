import { followCity } from "../pages/api/followApi"
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

interface ICreateUser {
  email: string
  name: string
  password?: string // optional in favor of social networks
  placeId?: string // optional in favor of social networks
  image?: string
}
export async function createUser({
  email,
  name,
  password,
  placeId,
  image,
}: ICreateUser) {
  if (isNullOrEmpty(email) || isNullOrEmpty(name)) return null
  const user = {
    userId: generateRandomString(15),
    password,
    email,
    name,
    placeId,
    picture: image,
  }
  const result = await dbInsertOne(USERS_COLLECTION, {
    ...user,
  })
  if (result.acknowledged) return user
  return null
}

export async function registerUserFlow(user: ICreateUser) {
  const newUser = await createUser(user)
  await followCity(newUser.placeId, newUser.userId)
  return newUser
}
