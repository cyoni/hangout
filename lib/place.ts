import { prisma } from "../prisma"
import { unique } from "./scripts/arrays"
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
        province: curr.state.name,
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
