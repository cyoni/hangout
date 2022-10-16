import { GET_CITY_DATA, GET_PROFILES_METHOD } from "./consts/consts"
import { CITY_API, PROFILE_API } from "./consts/apis"
import { getValue, setValue } from "./scripts/localStorage"
import { get, post } from "./postman"
import { getDifference, unique } from "./scripts/arrays"

export async function queryPlacesFromClient(cityCodes: string[]) {
  const uniqueCityCodes = unique(cityCodes)
  return await post({
    url: "api/queryPlacesApi",
    body: { codes: uniqueCityCodes },
  })
}

export async function getPlace(placeIds: string[]) {
  console.log("get place start. input:", placeIds)

  if (!Array.isArray(placeIds))
    return { error: "bad request: expects to get an array of placeIds" }

  const cleanedArray = placeIds.filter((x) => x)
  console.log("cleaned array:", cleanedArray)

  let convertedCitiesFromStorage = {}
  let citiesFromStorage: string[] = []

  const citiesFromStorageRaw = getValue("places")
  console.log("citiesFromStorageRaw", citiesFromStorageRaw)
  try {
    convertedCitiesFromStorage = await JSON.parse(citiesFromStorageRaw)

    console.log("convertedCitiesFromStoragejson", convertedCitiesFromStorage)
  } catch (e) {
    citiesFromStorage = []
  }

  const missingCities = getDifference(cleanedArray, citiesFromStorage)

  console.log("missingCities", missingCities)
  console.log("citiesFromStorage", citiesFromStorage)

  // if we have all data we need return data
  if (missingCities.length === 0) return convertedCitiesFromStorage

  // bring the missing data we don't have
  const params = {
    method: GET_CITY_DATA,
    placeIds: missingCities.toString(),
  }
  const result = await get(CITY_API, params)
  console.log("get city result", result)

  console.log("a", { ...result })
  console.log("b", { ...convertedCitiesFromStorage })

  if (result.data) {
    setValue(
      "places",
      JSON.stringify({
        ...result,
        ...convertedCitiesFromStorage,
      })
    )
  }
  console.log("result.data",result)
  return result
}
