import { PROFILE_API } from "./consts/apis"
import { post } from "./postman"

export async function queryPlacesFromClient(cityCodes: any[]) {
  return await post({
    url: "api/queryPlacesApi",
    body: { codes: cityCodes },
  })
}

export async function getProfile(userIds: string[]) {
  const data = await post({
    url: PROFILE_API,
    body: { userIds },
  })
  const profiles:Profile[] = data?.profiles
  return profiles
}
