import { prisma } from "../prisma"
export async function queryPlace(cityId: number) {
  const rawPlace = await prisma.cities.findUnique({
    where: {
      id: cityId,
    },
    include: {
      state: true,
      country: true
    }
  })
  
  console.log("queryPlace", rawPlace)

  const place: Place = rawPlace
    ? {
        city_id: rawPlace.id,
        country_id: rawPlace.country_id,
        province_id: rawPlace.state_id,
        city: rawPlace.name,
        province: rawPlace.state?.name,
        country: rawPlace.country?.name
      }
    : null
  return place
}
