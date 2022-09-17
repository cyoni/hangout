import { useQuery } from "@tanstack/react-query"
import { GET_CITY_DATA, GET_PROFILES_METHOD } from "./consts"
import { CITY_API, PROFILE_API } from "./consts/apis"
import { getValue, setValue } from "./localStorage"
import { get, post } from "./postman"
import {
  convertStringArrToNumber,
  getDifference,
  unique,
} from "./scripts/arrays"
import { getObjectKeys } from "./scripts/objects"

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

export async function getPlace(cityIds: number[]) {
  console.log("get place start. input:", cityIds)

  if (!Array.isArray(cityIds))
    return { error: "bad request: expects to get an array of cityIds" }

  const cleanedArray = cityIds.filter((x) => !isNaN(x))
  console.log("cleaned array:", cleanedArray)

  // const convertedCityIds: number[] = convertStringArrToNumber(cityIds)
  // console.log("convertedCityIds",convertedCityIds)

  let convertedCitiesFromStorage = {}
  let citiesFromStorage: number[] = []

  const citiesFromStorageRaw = getValue("places")
  console.log("citiesFromStorageRaw", citiesFromStorageRaw)
  try {
    convertedCitiesFromStorage = await JSON.parse(citiesFromStorageRaw)

    console.log("json", convertedCitiesFromStorage)

    citiesFromStorage = convertStringArrToNumber(
      getObjectKeys(convertedCitiesFromStorage)
    )
  } catch (e) {
    citiesFromStorage = []
  }

  const missingCities = getDifference(cleanedArray, citiesFromStorage)

  console.log("missingCities", missingCities)
  console.log("citiesFromStorage", citiesFromStorage)

  // if we have all data we need return data
  if (missingCities.length === 0) return convertedCitiesFromStorage

  // bring the missing data we don't have
  const result = await get(
    CITY_API,
    `method=${GET_CITY_DATA}&cityIds=${missingCities.toString()}`
  )
  console.log("get city result", result)

  console.log("a", { ...result.data })
  console.log("b", { ...convertedCitiesFromStorage })

  if (result.data) {
    setValue(
      "places",
      JSON.stringify({
        ...result.data,
        ...convertedCitiesFromStorage,
      })
    )
  }

  return result.data
}
