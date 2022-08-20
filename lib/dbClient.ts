import { useQuery } from "@tanstack/react-query"
import { GET_CITY_DATA, GET_PROFILES_METHOD } from "./consts"
import { CITY_API, PROFILE_API } from "./consts/apis"
import { getValue, setValue } from "./localStorage"
import { get, post } from "./postman"
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

export async function getPlace(cityIds: string[] | number[]): Promise<Place[]> {
  console.log("get place start. input:", cityIds)
  if (!Array.isArray(cityIds))
    return { error: "bad request: expects to get an array of cityIds" }

  // const setOfCityIds = new Set(cityIds)
  // let convertedCitiesFromStorage = null

  // // get data from local storage first
  // const citiesFromStorage = getValue("places")
  // if (citiesFromStorage) {
  //   convertedCitiesFromStorage = await JSON.parse(citiesFromStorage)

  //   const keys = Object.keys(convertedCitiesFromStorage) || null

  //   const setOfKeys = new Set(keys)

  //   setOfCityIds.forEach((city) => {
  //     if (setOfKeys.has(city)) {
  //       setOfCityIds.delete(city)
  //     }
  //   })
  // }
  const result = await get(
    CITY_API,
    `method=${GET_CITY_DATA}&cityIds=${cityIds.toString()}`
  )
  console.log(" get city result", result)

  if (result.data) {
    setValue("places", result.data)
  }

  return result.data
}
