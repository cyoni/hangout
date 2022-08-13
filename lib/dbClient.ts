import { GET_PROFILES_METHOD } from "./consts"
import { PROFILE_API } from "./consts/apis"
import { post } from "./postman"
import { unique } from "./scripts/arrays"

export async function queryPlacesFromClient(cityCodes: string[]) {
  const uniqueCityCodes = unique(cityCodes)
  return await post({
    url: "api/queryPlacesApi",
    body: { codes: uniqueCityCodes },
  })
}

export async function getProfile(userIds: string[]) {
  const data = await post({
    url: PROFILE_API,
    body: { method: GET_PROFILES_METHOD, userIds },
  })
  const profiles: Profile[] = data?.result
  return profiles
}
