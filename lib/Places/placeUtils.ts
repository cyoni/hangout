import { Place } from "../../pages/typings/typings"
import { prisma } from "../../prisma"
import { PLACES_COLLECTION } from "../consts/collections"
import { getFullPlaceName } from "../consts/place"
import { dbInsertMany, dbUpdateMany } from "../mongoUtils"
import { newGet } from "../postman"
import { unique } from "../scripts/arrays"
import { getSafeString } from "../scripts/strings"

async function queryLocation(input) {
  const safeString = getSafeString(input)
  if (!safeString) return null
  const places: Place[] = await prisma.$queryRawUnsafe(
    `SELECT city.name as city, 
    city.id as city_id,
    country.id as country_id,
    country.name as country, 
    state.id as province_id,
    state.name as province,
    state.iso2 as province_short 
    FROM cities as city 
    INNER JOIN countries as country ON country.id = city.country_id 
    INNER JOIN states as state ON city.state_id = state.id 
    WHERE city.name LIKE '${safeString}%' ORDER BY city.name ASC LIMIT 15`
  )
  return places
}

export async function queryPlace(cityId: number) {
  const rawPlace = await prisma.cities.findUnique({
    where: {
      id: cityId,
    },
    include: {
      state: true,
      country: true,
    },
  })

  console.log("queryPlace", rawPlace)

  const place: Place = rawPlace
    ? {
        city_id: rawPlace.id,
        country_id: rawPlace.country_id,
        province_id: rawPlace.state_id,
        province_short: rawPlace.state_code,
        city: rawPlace.name,
        province: rawPlace.state?.name,
        country: rawPlace.country?.name,
      }
    : null
  return place
}

export async function queryPlaces(
  cityIds: number[]
): Promise<{ [id: number]: Place; error?: string }> {
  if (!Array.isArray(cityIds)) return { error: "bad input" }
  const numbers = cityIds.map((cityId) => {
    return Number(cityId)
  })
  const uniqueIds = unique(numbers)
  const idsToQuery = uniqueIds.filter((number) => !isNaN(number))

  const rawPlaces = await prisma.cities.findMany({
    where: {
      id: {
        in: idsToQuery,
      },
    },
    include: {
      state: true,
      country: true,
    },
  })
  console.log("rawPlaces", rawPlaces)

  const results: { [id: number]: Place } = rawPlaces.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.id]: {
        city: curr?.name,
        provinceId: curr.state_id,
        province: curr.state?.name,
        province_short: curr.state_code,
        countryId: curr.country_code,
        country: curr.country?.name,
        province_long: curr.state?.name,
      },
    }),
    {}
  )

  return results
}

async function fetchAcData(input: string) {
  const serviceUrl = process.env.PLACES_AUTO_COMPLETE_SERVICE_URL
  const secret = process.env.PLACES_AUTO_COMPLETE_SECRET_KEY

  const result = await newGet(serviceUrl, { text: input, apiKey: secret })
  return result
}

interface IAutoCompleteResult {
  features: [
    {
      properties: {
        result_type: string
        city: string
        state: string
        country: string
        country_code: string
        place_id: string
        lon: string
        lat: string
        formatted: string
      }
    }
  ]
}

export async function queryAutoCompletePlace(input: string) {
  const data: IAutoCompleteResult = await fetchAcData(input)
  console.log("auto complete response", JSON.stringify(data))

  const placesArr: Place[] = []
  const filteredData = data.features.filter(
    (place) => place.properties.result_type === "city"
  )
  const placesToDb = filteredData.map((feature) => {
    const mapper = ({
      result_type,
      city,
      state,
      country,
      country_code,
      place_id,
      lon,
      lat,
      formatted,
    }) => ({
      resultType: result_type,
      city,
      state,
      country,
      countryCode: country_code,
      _id: "",
      placeId: place_id,
      lon,
      lat,
      formatted,
      queryKey: "",
    })
    const dbPlaceObj = mapper(feature.properties)
    const place: Place = { ...dbPlaceObj, queryKey: dbPlaceObj._id }
    dbPlaceObj._id = convertPlaceToQuery(place)
    placesArr.push(place)
    return dbPlaceObj
  })

  // update results in db

  await dbInsertMany(PLACES_COLLECTION, placesToDb, false)

  console.log("auto complete places ", placesArr)
  return placesArr
}

export async function getPlaceDetails(placeId: number) {
  return "https://api.geoapify.com/v2/place-details?id=51d9e66b3b1264414059e7edbe19eb0a4040f00101f9015e18150000000000c00208&apiKey=76627608a79b4529a1d8faca267b7045"
}

export function convertPlaceToQuery(place: Place) {
  if (!place) return ""
  const fullPlace = getFullPlaceName(place)
  return fullPlace.replaceAll(/(, | )/g, "-").toLocaleLowerCase()
}
