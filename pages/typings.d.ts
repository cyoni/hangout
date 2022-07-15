type City = {
  city_id: number
  city: string
  country_id: number
  country: string
  province_id: number
  province: string
}
type Place = {
  city_id: string
  province_id: string
  country_id: string
}

type JWT = {
  jwt: string
  user: { userId: string; name: string; place: Place }
}
